import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { PeoplesService } from '../../_peoples-services/people.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { LoaderService } from '@services/loader/loader.service';
import { MatAccordion } from '@angular/material/expansion';
import { customerStatusOptions } from '@constants/common-data/pages-common-data';

@Component({
  selector: 'app-create-customer-dialog',
  imports: [CommonModule, MaterialModule],
  templateUrl: './create-customer-dialog.component.html',
  styleUrl: './create-customer-dialog.component.scss'
})
export class CreateCustomerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateCustomerDialogComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  readonly router = inject(Router);
  readonly formBuilder = inject(FormBuilder);
  readonly peoplesService = inject(PeoplesService);
  readonly cd = inject(CommonDialogService);
  readonly loader = inject(LoaderService);

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  panelOpenState = false;  // Track expansion panel state
  id: any;  // Identifier for dialog action (add/edit)
  index: any;  // Row index if available
  selectedCustomer: any;  // Data of the customer to be edited

  //Form Fields variable start
  // Reactive form group for adding a customer
  addCustomerForm!: FormGroup
  //Form Fields variable end

  // Array to store image data
  images: any[] = []; // Array to hold image URLs

  // Customer status options
  customerStatusOptions = customerStatusOptions;


  constructor() {
    // Dialog setup: Prevent dialog close unless explicitly triggered
    this.dialogRef.disableClose = true;
    this.id = this.data.id;
    this.index = this.data.index;
    this.selectedCustomer = this.data.customer;
  }

  // Initialize the form and set values
  ngOnInit(): void {
    this.initializeForm();
    this.setValues();
  }

  // Create the form with validation rules
  initializeForm() {
    this.addCustomerForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      customerAddDate: ['', Validators.required],
      customerStatus: ['', Validators.required],
      customerId: ['', Validators.required],
      customerDescription: ['', Validators.required],
    });
  }

  // If editing, populate form with selected customer data
  setValues() {
    if (this.id == 'edit-customer') {
      this.editCustomer(this.selectedCustomer);
      console.log('index', this.index);
      console.log('selectedCustomer', this.selectedCustomer);
    }
  }

  // Check form validity
  get isAddCustomerFormValid(): boolean {
    return this.addCustomerForm.valid;
  }

  // Generate a unique customer code based on name and phone number
  generateCustomerCode() {
    const form = this.addCustomerForm;
    if (!form) {
      throw new Error('Form not initialized');
    }

    let customerName = form.get('customerName')?.value;
    if (!customerName) {
      throw new Error('Form values missing or invalid');
    }

    customerName = customerName.substring(0, 3).toUpperCase().padEnd(3, 'IN');
    const mobNoLastDigits = form.get('phone')?.value.toString().slice(-4);

    // Generate a unique ID based on current date and time in milliseconds
    const currentDate = new Date();
    const uniqueId = currentDate.getTime().toString().slice(-2); // Take last 6 digits of the timestamp

    // Get the current month name
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
    const firstTwoChars = monthName.substring(0, 2); // Get the first two characters of the month name
    const lastChar = monthName.slice(-1); // Get the last character of the month name

    // Construct the sub category code with the month name characters
    const generatedCustomerId = `${customerName}-${firstTwoChars}-${uniqueId}-${mobNoLastDigits}-${lastChar}`;

    // Optionally, update the form control with the generated sub category code
    form.get('customerId')?.setValue(generatedCustomerId); // Adjust 'customerId' to your actual form control name
    console.log('Generated Customer Code:', generatedCustomerId);
  }

  // Patch form with selected customer data
  editCustomer(selectedCustomer: any) {
    // this.addCustomerForm.patchValue({
    //   customerName: selectedCustomer?.customerName,
    //   email: selectedCustomer?.email,
    //   phone: selectedCustomer?.phone,
    //   city: selectedCustomer?.city,
    //   country: selectedCustomer?.country,
    //   address: selectedCustomer?.address,
    //   customerId: selectedCustomer?.customerId,
    //   customerAddDate: selectedCustomer?.customerAddDate,
    //   customerStatus: selectedCustomer?.customerStatus,
    //   customerDescription: selectedCustomer?.customerDescription,
    // })
    this.addCustomerForm.patchValue({ ...selectedCustomer });


    // If a profile image exists, update the image array
    if (selectedCustomer?.profileImage && Array.isArray(selectedCustomer?.profileImage)) {
      this.images = selectedCustomer?.profileImage.map((image: any) => ({
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
  // Submit the customer data
  onSubmit() {
    console.log('addCustomerForm Value', this.addCustomerForm?.value);

    let formValue: any = this.addCustomerForm?.value;

    // Include image data in the form value
    if (this.images.length > 0) {
      formValue.profileImage = this.images;
    }

    this.cd.openConfirmModal('Are you sure you want to add customer details?', () => {
      this.loader.startLoader();
      this.peoplesService.addCustomer(formValue);
    });

    this.dialogRef.close({
      index: this.index === 0 ? this.index : (this.index ? this.index : '')
    });
  }

  // utility functions

  // Validate form and return errors
  getFormValidationErrors() {
    const result: any = [];
    Object.keys(this.addCustomerForm?.controls).forEach((key) => {
      const controlErrors: any = this.addCustomerForm?.get(key)?.errors;
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
