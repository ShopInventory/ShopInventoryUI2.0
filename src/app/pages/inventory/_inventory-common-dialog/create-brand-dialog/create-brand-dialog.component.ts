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
    { value: '0', status: 'In-Active' },
    { value: '1', status: 'Active' }
  ];

  constructor(

  ) {
    this.dialogRef.disableClose = true;
    this.id = this.data.id;
    this.index = this.data.index;
    this.selectedBrand = this.data.category;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setValues();
  }

  initializeForm() {
    this.addBrandForm = this.formBuilder.group({
      brandName: ['', Validators.required],
      brandCode: ['', Validators.required],
      brandAddDate: ['', Validators.required],
      brandStatus: ['', Validators.required],
      brandDescription: ['', Validators.required],
    });
  }

  setValues() {
    if (this.id == 'edit-brand') {
      this.editBrand(this.selectedBrand);
      console.log('index', this.index);
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
    this.addBrandForm.patchValue({
      brandName: selectedBrand?.brandName,
      brandCode: selectedBrand?.brandCode,
      brandAddDate: selectedBrand?.brandAddDate,
      brandStatus: selectedBrand?.brandStatus,
      brandDescription: selectedBrand?.brandDescription,
    })
  }

  /*--------
  ---------- final submission ----------
  ----------*/
  onSubmit() {
    console.log('addBrandForm Value', this.addBrandForm?.value);

    let formValue: any = this.addBrandForm?.value;

    this.cd.openConfirmModal('Are you sure you want to appove the request?', () => {
      this.loader.startLoader();
      this.inventoryService.addBrand(formValue);
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
}
