import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { LoaderService } from '@services/loader/loader.service';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { InventoryService } from '../../_inventory-services/inventory.service';
import { productTypes, productCategories, units, brands } from '@constants/common-data/pages-common-data';

@Component({
  selector: 'app-create-sub-category-dialog',
  imports: [CommonModule, MaterialModule, MatButtonModule],
  templateUrl: './create-sub-category-dialog.component.html',
  styleUrl: './create-sub-category-dialog.component.scss'
})
export class CreateSubCategoryDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateSubCategoryDialogComponent>);
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
  selectedSubCategory: any;

  //Form Fields variable start
  addSubCategoryForm!: FormGroup
  //Form Fields variable end

  images: any[] = []; // Array to hold image URLs
  productCategoriesData: any = []
  subCategoryStatusOptions = [
    { value: '0', status: 'In-Active' },
    { value: '1', status: 'Active' }
  ];

    productTypes = productTypes;
    productCategories = productCategories;
    units = units;
    brands = brands;

  constructor(

  ) {
    this.dialogRef.disableClose = true;
    this.id = this.data.id;
    this.index = this.data.index;
    this.selectedSubCategory = this.data.subCategory;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setValues();
  }


  initializeForm() {
    this.addSubCategoryForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      subCategoryName: ['', Validators.required],
      subCategoryCode: ['', Validators.required],
      subCategoryAddDate: ['', Validators.required],
      subCategoryStatus: ['', Validators.required],
      subCategoryDescription: ['', Validators.required],
    });
  }

  setValues() {
    if (this.id == 'edit-sub-category') {
      this.editCategory(this.selectedSubCategory);
      console.log('index', this.index);
    }
  }

  get isAddSubCategoryFormValid(): boolean {
    return this.addSubCategoryForm.valid;
  }

  generateSubCategoryCode() {
    const form = this.addSubCategoryForm;
    if (!form) {
      throw new Error('Form not initialized');
    }

    const categoryId = form.get('categoryId')?.value;
    let subCategoryName = form.get('subCategoryName')?.value;
    if (!categoryId || !subCategoryName) {
      throw new Error('Form values missing or invalid');
    }

    // Find category object
    const category = this.productCategories.find((category: any) => category.productCategoryId == categoryId);
    if (!category) {
      throw new Error(`Category with ID '${categoryId}' not found`);
    }

    const categoryCode = category.productCategoryName.substring(0, 3).toUpperCase();
    subCategoryName = subCategoryName.substring(0, 3).toUpperCase().padEnd(3, 'IN');

    // Generate a unique ID based on current date and time in milliseconds
    const currentDate = new Date();
    const uniqueId = currentDate.getTime().toString().slice(-6); // Take last 6 digits of the timestamp

    // Get the current month name
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
    const firstTwoChars = monthName.substring(0, 2); // Get the first two characters of the month name
    const lastChar = monthName.slice(-1); // Get the last character of the month name

    // Construct the sub category code with the month name characters
    const generatedSubCatCode = `${categoryCode}-${subCategoryName}-${firstTwoChars}-${uniqueId}-${lastChar}`;

    // Optionally, update the form control with the generated sub category code
    form.get('subCategoryCode')?.setValue(generatedSubCatCode); // Adjust 'subCategoryCode' to your actual form control name
    console.log('Generated Sub Category Code:', generatedSubCatCode);
  }

  editCategory(selectedSubCategory: any) {
    this.addSubCategoryForm.patchValue({
      categoryId: selectedSubCategory?.categoryId,
      subCategoryName: selectedSubCategory?.subCategoryName,
      subCategoryCode: selectedSubCategory?.subCategoryCode,
      subCategoryAddDate: selectedSubCategory?.subCategoryAddDate,
      subCategoryStatus: selectedSubCategory?.subCategoryStatus,
      subCategoryDescription: selectedSubCategory?.subCategoryDescription,
    })
  }


  getcategoryIdName(productCategoryId: number): string | undefined {
    const categoryId = this.productCategories.find((category: any) => category.productCategoryId == productCategoryId);
    return categoryId ? categoryId.productCategoryName : undefined;
  }

  /*--------
  ---------- final submission ----------
  ----------*/
  onSubmit() {
    console.log('addSubCategoryForm Value', this.addSubCategoryForm?.value);

    const categoryIdName = this.getcategoryIdName(this.addSubCategoryForm?.get('categoryId')?.value);
    let formValue: any = this.addSubCategoryForm?.value;
    formValue = {
      ...formValue,
      categoryIdName: categoryIdName,
    };

    this.cd.openConfirmModal('Are you sure you want to appove the request?', () => {
      this.loader.startLoader();
      this.inventoryService.addSubCategory(formValue);
    });

    this.dialogRef.close({
      index: this.index === 0 ? this.index : (this.index ? this.index : '')
    });
    // const navigateurl = `/inventory/products`;
    // this.router.navigateByUrl(navigateurl);
  }

  // utility functions
  getFormValidationErrors() {
    const result: any = [];
    Object.keys(this.addSubCategoryForm?.controls).forEach((key) => {
      const controlErrors: any = this.addSubCategoryForm?.get(key)?.errors;
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
}
