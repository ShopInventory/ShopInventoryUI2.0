import { Component, inject, ViewChild } from '@angular/core';
import { CreateBrandDialogComponent } from "../_inventory-common-dialog/create-brand-dialog/create-brand-dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { LoaderService } from '@services/loader/loader.service';
import { InventoryService } from '../_inventory-services/inventory.service';
import { first } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { GenericTableComponent } from 'src/app/shared/shared-component/custom-components/generic-table/generic-table.component';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, MaterialModule, GenericTableComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  brandsDataSource = new MatTableDataSource<any>();
  brandsDisplayedColumns: string[] = ['srNo', 'brandName', 'brandCode', 'brandAddDate', 'status', 'action'];

  panelOpenState = false;
  brandsData: any = [];

  isHovered: boolean = false;

  productColumnDefs = [
    { header: 'Sr. No.', field: 'srNo' },
    { header: 'Brand', field: 'brandName' },
    { header: 'Brand Code', field: 'brandCode' },
    { header: 'Status', field: 'status' },
    { header: 'Created', field: 'brandAddDate', type: 'date' },  // Customize for date fields
    { header: 'Action', field: 'action' },
  ];

  readonly dialog = inject(MatDialog);
  readonly inventoryService = inject(InventoryService);
  readonly loader = inject(LoaderService);
  readonly cd = inject(CommonDialogService);

  constructor(

  ) { }

  ngOnInit(): void {
    // this.setValues();
  }

  ngAfterViewInit(): void {
    this.brandsDataSource.paginator = this.paginator;
    this.brandsDataSource.sort = this.sort;
  }


  // filter apply
  filterApply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.brandsDataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  setValues() {
    this.getBrandDetails();
  }


  getBrandDetails(categoryId?: any) {
    const reqData = {
      categoryId: categoryId
    }
    this.loader.startLoader();
    this.inventoryService.getBrandDetails(reqData).subscribe({
      next: (res: any) => {
        this.loader.stopLoader();
        // this.brandsData = res?.data;
        console.log('Data', res?.data);

        if (Array.isArray(res?.data)) {
          this.brandsData = res?.data;
        } else {
          const brandExists = this.brandsData.some(
            (brand: any) => brand.brandCode == res?.data.brandCode
          );
          if (!brandExists) {
            this.brandsData.push(res?.data);
          }
        }
        console.log('brandsData', this.brandsData);
        console.log('brandsDataSource', this.brandsDataSource.data);
        // this.loader.stopLoader();
        // this.cd.openSuccessModal('Successful !');
        this.brandsDataSource.data = [...this.brandsData];
      },
      error: (err) => {
        this.loader.stopLoader();
        this.cd.openErrorModal('CONNECTION_TIME_OUT', 'Error');
      }
    });
  }

  addBrand(id: any) {
    const dialogRef = this.dialog.open(CreateBrandDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.inventoryService?.brandCast?.pipe(first()).subscribe((data: any) => {
        console.log('Data', data);

        if (Array.isArray(data)) {
          this.brandsData = data;
        } else {
          const brandExists = this.brandsData.some(
            (brand: any) => brand.brandCode == data.brandCode
          );
          if (!brandExists) {
            this.brandsData.push(data);
          }
        }
        console.log('brandsData', this.brandsData);
        console.log('brandsDataSource', this.brandsDataSource.data);
        this.loader.stopLoader();
        this.brandsDataSource.data = [...this.brandsData];
        console.log('brandsDataSource after', this.brandsDataSource.data);
      });
    });
  }

  editBrand(index: number, id: any) {
    const selectedBrand = this.brandsData[index];
    const dialogRef = this.dialog.open(CreateBrandDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id,
        brand: selectedBrand,
        index: index
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      this.inventoryService?.brandCast?.pipe(first()).subscribe((updatedBrand: any) => {
        this.brandsData[data.index] = updatedBrand;
        this.brandsDataSource.data = [...this.brandsData];
        this.brandsDataSource._updateChangeSubscription();
        this.loader.stopLoader();
      });
    });
  }

  deleteBrand(index: number) {
    this.cd.openConfirmModal('Are you sure you want to delete this brand?', () => {
      this.brandsData.splice(index, 1);
      this.brandsDataSource.data = [...this.brandsData];
      this.brandsDataSource._updateChangeSubscription();
    });
  }

  openSuccessDialog() {
    // alert('Hello')
    // this.cd.openSuccessModal('Successful !');
    // this.cd.openConfirmModal('Successful !');
    // this.cd.openConsentConfirmModal('Successful !');
    // this.cd.openErrorModal('Successful !');
    // this.loader.startLoader();
    // setTimeout(() => {
    //   this.loader.stopLoader();
    // }, 1000);
  }

  // Utility functions
  onHover(hoverState: boolean) {
    this.isHovered = hoverState;
  }
  pdfDownload() {
    const doc = new jsPDF();

    // Define table headers based on displayed columns
    const headers = [
      'Sr. No.',
      'Brand',
      'Brand Code',
      'Created',
      'Status'
    ];

    // Access the data from the MatTableDataSource
    const rows = this.brandsDataSource.data.map((row: any, index: number) => [
      index + 1, // Sr. No.
      row.brandName,
      row.brandCode,
      row.supplierAddDate, // Format as needed
      row.brandStatus === '1' ? 'Active' : 'Inactive'
    ]);

    // Generate the PDF table
    autoTable(doc, {
      head: [headers],
      body: rows,
    });

    // Save the PDF file
    doc.save('Brands.pdf');
  }



  excelDownload() {
    const worksheet = XLSX.utils.json_to_sheet(this.brandsDataSource.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Brands');
    XLSX.writeFile(workbook, 'Brands.xlsx');
  }

  print() {
    const printContent = document.querySelector('.brand-table-container')?.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && printContent) {
      printWindow.document.write(`<html><head><title>Print</title></head><body>${printContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  }


  onEditProduct(index: any) {
    console.log('Edit product', index);
    this.editBrand(index, 'edit-brand');
  }

  onDeleteProduct(index: any) {
    console.log('Delete product', index);
    this.deleteBrand(index);
  }
}
