import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { PeoplesService } from '../../_peoples-services/people.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { LoaderService } from '@services/loader/loader.service';
import { MatAccordion } from '@angular/material/expansion';
import { banksList, branchesList, statesList, supplierStatusOptions } from '@constants/common-data/pages-common-data';
import { GenericSearchableDropdownComponent } from 'src/app/shared/shared-component/custom-components/generic-searchable-dropdown/generic-searchable-dropdown.component';

@Component({
  selector: 'app-create-supplier-dialog',
  imports: [CommonModule, MaterialModule, GenericSearchableDropdownComponent],
  templateUrl: './create-supplier-dialog.component.html',
  styleUrl: './create-supplier-dialog.component.scss'
})
export class CreateSupplierDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateSupplierDialogComponent>);
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
  selectedSupplier: any;  // Data of the supplier to be edited

  newStateId: any;
  newStateName: any;

  //Form Fields variable start
  // Reactive form group for adding a supplier
  addSupplierForm!: FormGroup
  //Form Fields variable end

  // Array to store image data
  images: any[] = []; // Array to hold image URLs

  // Use the imported lists
  statesList = statesList;
  banksList = banksList;
  branchesList = branchesList;
  supplierStatusOptions = supplierStatusOptions;

  constructor() {
    this.dialogRef.disableClose = true;
    this.id = this.data.id;
    this.index = this.data.index;
    this.selectedSupplier = this.data.supplier;

  }


  // Initialize the form and set values
  ngOnInit(): void {
    this.initializeForm();
    this.setValues();
  }

  // Create the form with validation rules
  initializeForm() {
    this.addSupplierForm = this.formBuilder.group({
      supplierName: ['', Validators.required],
      supplierCompanyName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      gstNo: ['', Validators.required],
      panNo: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      supplierAddDate: ['', Validators.required],
      supplierStatus: ['', Validators.required],
      supplierId: ['', Validators.required],
      supplierDescription: ['', Validators.required],
      // supplier bank information
      supplierBankBenificiaryName: ['', Validators.required],
      supplierBankIfscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      supplierBankName: ['', Validators.required],
      supplierBankBranchName: ['', Validators.required],
      supplierBankAccountNo: ['', [Validators.required, Validators.maxLength(17)]],
      confirmBankAccountNo: ['', [Validators.required, this.matchingAccounts.bind(this)]]
    });
  }

  // If editing, populate form with selected supplier data
  setValues() {
    if (this.id == 'edit-supplier') {
      this.editSupplier(this.selectedSupplier);
      console.log('index', this.index);
    }
  }

  // Check form validity
  get isAddSupplierFormValid(): boolean {
    return this.addSupplierForm.valid;
  }

  // Generate a unique supplier code based on name and phone number
  generateSupplierCode() {
    const form = this.addSupplierForm;
    if (!form) {
      throw new Error('Form not initialized');
    }

    let supplierName = form.get('supplierName')?.value;
    if (!supplierName) {
      throw new Error('Form values missing or invalid');
    }

    supplierName = supplierName.substring(0, 3).toUpperCase().padEnd(3, 'IN');
    const mobNoLastDigits = form.get('phone')?.value.toString().slice(-4);

    // Generate a unique ID based on current date and time in milliseconds
    const currentDate = new Date();
    const uniqueId = currentDate.getTime().toString().slice(-2); // Take last 6 digits of the timestamp

    // Get the current month name
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
    const firstTwoChars = monthName.substring(0, 2); // Get the first two characters of the month name
    const lastChar = monthName.slice(-1); // Get the last character of the month name

    // Construct the sub category code with the month name characters
    const generatedSupplierId = `${supplierName}-${firstTwoChars}-${uniqueId}-${mobNoLastDigits}-${lastChar}`;

    // Optionally, update the form control with the generated sub category code
    form.get('supplierId')?.setValue(generatedSupplierId); // Adjust 'supplierId' to your actual form control name
    console.log('Generated Supplier Code:', generatedSupplierId);
  }

  // Patch form with selected supplier data
  editSupplier(selectedSupplier: any) {
    // this.addSupplierForm.patchValue({
    //   supplierName: selectedSupplier?.supplierName,
    //   email: selectedSupplier?.email,
    //   phone: selectedSupplier?.phone,
    //   city: selectedSupplier?.city,
    //   country: selectedSupplier?.country,
    //   address: selectedSupplier?.address,
    //   supplierId: selectedSupplier?.supplierId,
    //   supplierAddDate: selectedSupplier?.supplierAddDate,
    //   supplierStatus: selectedSupplier?.supplierStatus,
    //   supplierDescription: selectedSupplier?.supplierDescription,
    // })
    this.addSupplierForm.patchValue({ ...selectedSupplier });


    // If a profile image exists, update the image array
    if (selectedSupplier?.profileImage && Array.isArray(selectedSupplier?.profileImage)) {
      this.images = selectedSupplier?.profileImage.map((image: any) => ({
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
  // Submit the supplier data
  onSubmit() {
    console.log('addSupplierForm Value', this.addSupplierForm?.value);

    let formValue: any = this.addSupplierForm?.value;

    // Include image data in the form value
    if (this.images.length > 0) {
      formValue.profileImage = this.images;
    }

    this.cd.openConfirmModal('Are you sure you want to add supplier details?', () => {
      this.loader.startLoader();
      this.peoplesService.addSupplier(formValue);
    });

    this.dialogRef.close({
      index: this.index === 0 ? this.index : (this.index ? this.index : '')
    });
  }

  // utility functions
  // Custom validator for matching bank account numbers
  matchingAccounts(control: FormControl): { [key: string]: boolean } | null {
    const supplierBankAccountNo = this.addSupplierForm?.get('supplierBankAccountNo')?.value;
    const confirmBankAccountNo = control.value;

    if (supplierBankAccountNo !== confirmBankAccountNo) {
      return { 'mismatch': true };
    }

    return null;
  }

  // Validate form and return errors
  getFormValidationErrors() {
    const result: any = [];
    Object.keys(this.addSupplierForm?.controls).forEach((key) => {
      const controlErrors: any = this.addSupplierForm?.get(key)?.errors;
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


  onStateIdChange(event: any) {
    console.log('event SubServiceCategoryIdChange', event);
    this.newStateId = event.selectedRow.stateId;
    this.newStateName = event.selectedRow.stateNameEn;
  }
}
