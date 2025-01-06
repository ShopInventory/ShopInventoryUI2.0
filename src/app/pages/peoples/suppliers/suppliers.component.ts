import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeoplesService } from '../_peoples-services/people.service';
import { LoaderService } from '@services/loader/loader.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateSupplierDialogComponent } from '../_people-common-dialog/create-supplier-dialog/create-supplier-dialog.component';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, MaterialModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent {

  readonly dialog = inject(MatDialog);
  readonly peoplesService = inject(PeoplesService);
  readonly loader = inject(LoaderService);
  readonly cd = inject(CommonDialogService);

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  suppliersDataSource = new MatTableDataSource<any>();
  suppliersDisplayedColumns: string[] = ['srNo', 'supplierName', 'supplierCompanyName', 'supplierId', 'email', 'phone', 'address', 'city', 'country', 'created', 'status', 'action'];

  panelOpenState = false;
  suppliersData: any = []

  constructor() {

  }

  ngOnInit(): void {
    // this.setValues();
  }

  ngAfterViewInit(): void {
    this.suppliersDataSource.paginator = this.paginator;
    this.suppliersDataSource.sort = this.sort;
  }


  // filter apply
  filterApply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.suppliersDataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  setValues() {
    this.getSupplierDetails();
  }

  getSupplierDetails(supplierId?: any) {
    const reqData = {
      supplierId: supplierId
    }
    this.loader.startLoader();
    this.peoplesService.getCustomerDetails(reqData).subscribe({
      next: (res: any) => {
        this.loader.stopLoader();
        // this.categoriesData = res?.data;
        console.log('Data', res?.data);

        if (Array.isArray(res?.data)) {
          this.suppliersData = res?.data;
        } else {
          const supplierExists = this.suppliersData.some(
            (supplier: any) => supplier.supplierCode == res?.data.supplierCode
          );
          if (!supplierExists) {
            this.suppliersData.push(res?.data);
          }
        }
        console.log('suppliersData', this.suppliersData);
        console.log('suppliersDataSource', this.suppliersDataSource.data);
        // this.loader.stopLoader();
        // this.cd.openSuccessModal('Successful !');
        this.suppliersDataSource.data = [...this.suppliersData];
      },
      error: (err: any) => {
        this.loader.stopLoader();
        this.cd.openErrorModal('CONNECTION_TIME_OUT', 'Error');
      }
    });
  }

  addSupplier(id: any) {
    const dialogRef = this.dialog.open(CreateSupplierDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.peoplesService?.supplierCast?.pipe(first()).subscribe((data: any) => {
        console.log('Data', data);

        if (Array.isArray(data)) {
          this.suppliersData = data;
        } else {
          const supplierExists = this.suppliersData.some(
            (supplier: any) => supplier.supplierCode == data.supplierCode
          );
          if (!supplierExists) {
            this.suppliersData.push(data);
          }
        }
        console.log('suppliersData', this.suppliersData);
        console.log('suppliersDataSource', this.suppliersDataSource.data);
        this.loader.stopLoader();
        this.cd.openSuccessModal('Successful !');
        this.suppliersDataSource.data = [...this.suppliersData];
      });
    });
  }

  editSupplier(index: number, id: any) {
    const selectedSupplier = this.suppliersData[index];
    const dialogRef = this.dialog.open(CreateSupplierDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id,
        supplier: selectedSupplier,
        index: index
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      this.peoplesService?.supplierCast?.pipe(first()).subscribe((updatedSupplier: any) => {
        this.suppliersData = [];
        if (Array.isArray(updatedSupplier)) {
          this.suppliersData = updatedSupplier;
        } else {
          const supplierExists = this.suppliersData.some(
            (supplier: any) => supplier.supplierCode == updatedSupplier.supplierCode
          );
          if (!supplierExists) {
            this.suppliersData.push(updatedSupplier);
          }
        }
        this.suppliersDataSource.data[data.index] = updatedSupplier;
        this.suppliersDataSource._updateChangeSubscription();
        this.loader.stopLoader();
        this.cd.openSuccessModal('Successful !');
      });
    });
  }

  deleteSupplier(index: number) {
    this.cd.openConfirmModal('Are you sure you want to delete this supplier?', () => {
      this.suppliersData.splice(index, 1);
      this.suppliersDataSource.data = [...this.suppliersData];
      this.suppliersDataSource._updateChangeSubscription();
    });
  }

  // Utility functions

  pdfDownload() {
    const doc = new jsPDF();

    // Define table headers based on displayed columns
    const headers = [
      'Sr. No.',
      'Supplier Name',
      'Firm/Company',
      'Supplier ID',
      'Email ID',
      'Phone No.',
      'GST No.',
      'PAN No.',
      'Address',
      'City',
      'State',
      'Country',
      'Created Date',
      'Status'
    ];

    // Access the data from the MatTableDataSource
    const rows = this.suppliersDataSource.data.map((row: any, index: number) => [
      index + 1, // Sr. No.
      row.supplierName,
      row.supplierCompanyName,
      row.supplierId,
      row.email,
      row.phone,
      row.gstNo,
      row.panNo,
      row.address,
      row.city,
      row.state,
      row.country,
      row.supplierAddDate, // Format as needed
      row.supplierStatus === '1' ? 'Active' : 'Inactive'
    ]);

    // Generate the PDF table
    autoTable(doc, {
      head: [headers],
      body: rows,
    });

    // Save the PDF file
    doc.save('Suppliers.pdf');
  }



  excelDownload() {
    const worksheet = XLSX.utils.json_to_sheet(this.suppliersDataSource.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');
    XLSX.writeFile(workbook, 'Suppliers.xlsx');
  }

  print() {
    const printContent = document.querySelector('.supplier-table-container')?.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && printContent) {
      printWindow.document.write(`<html><head><title>Print</title></head><body>${printContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  }
}

