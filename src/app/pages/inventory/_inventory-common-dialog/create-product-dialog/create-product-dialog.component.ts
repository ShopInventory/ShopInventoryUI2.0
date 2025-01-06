import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { InventoryService } from '../../_inventory-services/inventory.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { brands, productCategories, productTypes, units } from '@constants/common-data/pages-common-data';
import { LoaderService } from '@services/loader/loader.service';

@Component({
  selector: 'app-create-product-dialog',
  imports: [CommonModule, MaterialModule, MatDialogClose, MatButtonModule],
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss'
})
export class CreateProductDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateProductDialogComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  readonly router = inject(Router);
  readonly formBuilder = inject(FormBuilder);
  readonly inventoryService = inject(InventoryService);
  readonly cd = inject(CommonDialogService);
  readonly loader = inject(LoaderService);

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  panelOpenState = false;
  id: any;
  index: any;
  selectedProduct: any;

  //Form Fields variable start
  addProductForm!: FormGroup
  //Form Fields variable end

  images: any[] = []; // Array to hold image URLs
  productCategoriesData: any = [];

  productTypes = productTypes;
  productCategories = productCategories;
  units = units;
  brands = brands;

  hello() {
    this.dialogRef.close('Hello');
  }

  constructor(

  ) {
    this.dialogRef.disableClose = true;
    this.id = this.data.id;
    this.index = this.data.index;
    this.selectedProduct = this.data.product;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setValues();
  }


  initializeForm() {
    this.addProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productType: ['', Validators.required],
      productCategory: ['', Validators.required],
      productSubCategory: ['', Validators.required],
      productBrand: ['', Validators.required],
      productQty: ['', Validators.required],
      productUnit: ['', Validators.required],
      productSku: ['', Validators.required],
      productCreateDate: ['', Validators.required],
      productDescription: ['', Validators.required],
    });
  }

  setValues() {
    if (this.id == 'edit-product') {
      this.editProduct(this.selectedProduct);
      console.log('index', this.index);
    }
  }

  get isAddProductFormValid(): boolean {
    return this.addProductForm.valid;
  }


  editProduct(selectedProduct: any) {
    console.log('selectedProduct',selectedProduct);

    // this.addProductForm.patchValue({
    //   productName: selectedProduct?.productName,
    //   productType: selectedProduct?.productType,
    //   productCategory: selectedProduct?.productCategory,
    //   productSubCategory: selectedProduct?.productSubCategory,
    //   productBrand: selectedProduct?.productBrand,
    //   productQty: selectedProduct?.productQty,
    //   productUnit: selectedProduct?.productUnit,
    //   productSku: selectedProduct?.productSku,
    //   productCreateDate: selectedProduct?.productCreateDate,
    //   productDescription: selectedProduct?.productDescription,
    // })
    this.addProductForm.patchValue({ ...selectedProduct });

    // If the selected product has multiple images, update the images array
    if (selectedProduct?.productImages && Array.isArray(selectedProduct.productImages)) {
      this.images = selectedProduct.productImages.map((image: any) => ({
        src: image.src, // Image source (base64 or URL)
        name: image.name, // Image name
        size: image.size, // Image size (in KB or appropriate unit)
        type: image.type // MIME type of the image
      }));
    } else {
      // Clear images if no productImages exist
      this.images = [];
    }
  }

  generateSKU() {
    const form = this.addProductForm;

    if (!form) {
      throw new Error('Form not initialized');
    }

    const productCategory = form.get('productCategory')?.value;
    const productSubCategory = form.get('productSubCategory')?.value;
    const productBrand = form.get('productBrand')?.value;

    if (!productCategory || !productSubCategory || !productBrand) {
      throw new Error('Form values missing or invalid');
    }

    // Find category object
    const category = this.productCategories.find((category: any) => category.productCategoryId == productCategory);
    if (!category) {
      throw new Error(`Category with ID '${productCategory}' not found`);
    }

    // Find subcategory object
    const subCategory = this.productCategories.find((subcat: any) => subcat.productCategoryId == productSubCategory);
    if (!subCategory) {
      throw new Error(`Subcategory with ID '${productSubCategory}' not found`);
    }

    // Find brand object
    const brand = this.brands.find((b: any) => b.brandId == productBrand);
    if (!brand) {
      throw new Error(`Brand with ID '${productBrand}' not found`);
    }

    const categoryCode = category.productCategoryName.substring(0, 3).toUpperCase();
    const subCategoryCode = subCategory.productCategoryName.substring(0, 3).toUpperCase();
    const brandCode = brand.brandCode.substring(0, 3).toUpperCase();

    // Generate a unique ID based on current date and time in milliseconds
    const currentDate = new Date();
    const uniqueId = currentDate.getTime().toString().slice(-6); // Take last 6 digits of the timestamp

    const generatedSKU = `${categoryCode}-${subCategoryCode}-${brandCode}-${uniqueId}`;

    // Optionally, update the form control with the generated SKU
    form.get('productSku')?.setValue(generatedSKU); // Adjust 'generatedSKU' to your actual form control name

    console.log('Generated SKU:', generatedSKU);
  }

  getProductTypeName(productTypeId: number): string | undefined {
    const productType = this.productTypes.find((productType: any) => productType.value == productTypeId);
    return productType ? productType.productTypeName : undefined;
  }

  getProductCategoryName(productCategoryId: number): string | undefined {
    const productCategory = this.productCategories.find((category: any) => category.productCategoryId == productCategoryId);
    return productCategory ? productCategory.productCategoryName : undefined;
  }

  getProductSubCategoryName(productSubCategoryId: number): string | undefined {
    const productSubCategory = this.productCategories.find((category: any) => category.productCategoryId == productSubCategoryId);
    return productSubCategory ? productSubCategory.productCategoryName : undefined;
  }

  getUnitName(unitId: number): string | undefined {
    const unit = this.units.find((unit: any) => unit.value == unitId);
    return unit ? unit.unitName : undefined;
  }

  getBrandName(brandId: number): string | undefined {
    const brand = this.brands.find((brand: any) => brand.brandId == brandId);
    return brand ? brand.brandName : undefined;
  }


  /*--------
  ---------- final submission ----------
  ----------*/
  onSubmit() {
    console.log('AddProductForm Value', this.addProductForm?.value);
    const productTypeName = this.getProductTypeName(this.addProductForm?.get('productType')?.value);
    const productCategoryName = this.getProductCategoryName(this.addProductForm?.get('productCategory')?.value);
    const productSubCategoryName = this.getProductCategoryName(this.addProductForm?.get('productSubCategory')?.value);
    const productUnitName = this.getUnitName(this.addProductForm?.get('productUnit')?.value);
    const productBrandName = this.getBrandName(this.addProductForm?.get('productBrand')?.value);
    let formValue: any = this.addProductForm?.value;
    formValue = {
      ...formValue,
      productTypeName: productTypeName,
      productCategoryName: productCategoryName,
      productSubCategoryName: productSubCategoryName,
      productUnitName: productUnitName,
      productBrandName: productBrandName,
    };


    // Include image data in the form value
    if (this.images.length > 0) {
      formValue.productImages = this.images;
    }

    this.cd.openConfirmModal('Are you sure you want to appove the request?', () => {
      // this.loader.startLoader();
      this.inventoryService.addProduct(formValue);
    });

    this.dialogRef.close({
      index: this.index === 0 ? this.index : (this.index ? this.index : '')
    });
  }

  // utility functions
  getFormValidationErrors() {
    const result: any = [];
    Object.keys(this.addProductForm?.controls).forEach((key) => {
      const controlErrors: any = this.addProductForm?.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          result.push({
            control: key,
            error: keyError,
            value: controlErrors[keyError],
          });
        });
      }
    });
    return result;
  }

  openAddCategory() {
    // this.cd.openSuccessModal('Successful !');
  }

  // Trigger file input click
  triggerFileUpload(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  // Handle file selection
  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      // Convert FileList to Array
      const fileArray = Array.from(files);

      fileArray.forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // this.images.push(e.target.result); // Add image to array
          this.images.push({
            src: e.target.result,
            name: file.name,
            size: (file.size / 1024).toFixed(2), // Size in KB
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = ''; // Clear the input after upload
  }

  // Delete an image from the preview list
  deleteImage(index: number) {
    this.images.splice(index, 1); // Remove the image at the given index
  }
}
