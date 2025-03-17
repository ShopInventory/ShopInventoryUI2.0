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

@Component({
  selector: 'app-create-brand-dialog',
  imports: [CommonModule, MaterialModule, MatButtonModule],
  templateUrl: './create-brand-dialog.component.html',
  styleUrl: './create-brand-dialog.component.scss'
})
export class CreateBrandDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateBrandDialogComponent>);
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
  selectedBrand: any;

  //Form Fields variable start
  addBrandForm!: FormGroup
  //Form Fields variable end

  images: any[] = []; // Array to hold image URLs
  brandStatusOptions = [
    { value: false, status: 'In-Active' },
    { value: true, status: 'Active' }
  ];

  constructor(

  ) {
    this.dialogRef.disableClose = true;
    this.id = this.data.id;
    // this.index = this.data.index;
    this.selectedBrand = this.data.brand;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setValues();
  }

  initializeForm() {
    this.addBrandForm = this.formBuilder.group({
      brandName: ['', Validators.required],
      brandCode: [{ value: '', disabled: true }, Validators.required],
      createdAt: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  setValues() {
    if (this.id == 'edit-brand') {
      this.editBrand(this.selectedBrand);
      // console.log('index', this.index);
      console.log('selectedBrand', this.selectedBrand);
    }
  }

  get isAddBrandFormValid(): boolean {
    return this.addBrandForm.valid;
  }

  generateBrandCode() {
    const form = this.addBrandForm;
    if (!form) {
      throw new Error('Form not initialized');
    }

    let brandName = form.get('brandName')?.value;
    if (!brandName) {
      throw new Error('Form values missing or invalid');
    }

    brandName = brandName.substring(0, 3).toUpperCase().padEnd(3, 'IN');

    // Generate a unique ID based on current date and time in milliseconds
    const currentDate = new Date();
    const uniqueId = currentDate.getTime().toString().slice(-6); // Take last 6 digits of the timestamp

    // Get the current month name
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
    const firstTwoChars = monthName.substring(0, 2); // Get the first two characters of the month name
    const lastChar = monthName.slice(-1); // Get the last character of the month name

    // Construct the sub category code with the month name characters
    const generatedBrandCode = `${brandName}-${firstTwoChars}-${uniqueId}-${lastChar}`;

    // Optionally, update the form control with the generated sub category code
    form.get('brandCode')?.setValue(generatedBrandCode); // Adjust 'brandCode' to your actual form control name
    console.log('Generated Brand Code:', generatedBrandCode);
  }

  editBrand(selectedBrand: any) {
    // this.addBrandForm.patchValue({
    //   brandName: selectedBrand?.brandName,
    //   brandCode: selectedBrand?.brandCode,
    //   brandAddDate: selectedBrand?.brandAddDate,
    //   brandStatus: selectedBrand?.brandStatus,
    //   brandDescription: selectedBrand?.brandDescription,
    // })

    this.addBrandForm.patchValue({ ...selectedBrand });

    // If a brand logo image exists, update the image array
    if (selectedBrand?.profileImage && Array.isArray(selectedBrand?.profileImage)) {
      this.images = selectedBrand?.profileImage.map((image: any) => ({
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

  /*--------
  ---------- final submission ----------
  ----------*/
  onSubmit() {
    console.log('addBrandForm Value', this.addBrandForm?.value);

    let formValue: any = this.addBrandForm?.value;

    // Include image data in the form value
    if (this.images.length > 0) {
      // formValue.profileImage = this.images;
    }

    delete formValue.brandCode

    this.cd.openConfirmModal('Are you sure you want to appove the request?', () => {
      this.loader.startLoader();
      // this.inventoryService.addBrand(formValue);
      this.inventoryService.saveBrandDetails(formValue);
      this.inventoryService.saveBrandDetails(formValue).subscribe({
        next: (res: any) => {
          this.loader.stopLoader();
          const message = res.status ? `${res.message}` : res.error;

          res.status ? this.cd.openSuccessModal(message) : this.cd.openErrorModal(message, 'Error');
        },
        error: (err) => {
          this.loader.stopLoader();
          this.cd.openErrorModal(err.error.description, err.error.code);
        }
      });
    });

    this.dialogRef.close({
      index: this.index === 0 ? this.index : (this.index ? this.index : '')
    });
  }

  // utility functions
  getFormValidationErrors() {
    const result: any = [];
    Object.keys(this.addBrandForm?.controls).forEach((key) => {
      const controlErrors: any = this.addBrandForm?.get(key)?.errors;
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


  // Trigger file input click
  triggerFileUpload(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  // Handle file selection and validate file type
  onFileSelected(event: any) {
    const file = event.target.files[0]; // Get the first selected file
    const fileType = file.type.toLowerCase(); // Get the file type in lowercase

    if (file) {
      // Check if the file type is not JPEG or JPG
      if (fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
        // Display alert if the file type is not allowed
        alert('Only JPG or JPEG file format is allowed.');
        // Clear the input field
        event.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;

        // Log the base64 encoded string to the console
        console.log('Base64 Image:', base64String);

        this.images = []; // Clear any existing image
        this.images.push({
          src: base64String, // base64 encoded image data
          name: file.name,
          size: (file.size / 1024).toFixed(2), // Size in KB
          type: file.type
        });
      };
      reader.readAsDataURL(file); // Convert image to base64 format
    }
    event.target.value = ''; // Clear the input after upload
  }

  // Delete the image from the preview
  // Remove selected image
  deleteImage() {
    this.images = []; // Clear the image array
  }
}
