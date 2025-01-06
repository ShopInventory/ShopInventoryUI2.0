import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { LoaderService } from '@services/loader/loader.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateCustomerDialogComponent } from '../_people-common-dialog/create-customer-dialog/create-customer-dialog.component';
import { PeoplesService } from '../_peoples-services/people.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, MaterialModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {

  readonly dialog = inject(MatDialog);
  readonly peoplesService = inject(PeoplesService);
  readonly loader = inject(LoaderService);
  readonly cd = inject(CommonDialogService);

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  customersDataSource = new MatTableDataSource<any>();
  customersDisplayedColumns: string[] = ['srNo', 'customerName', 'customerId', 'email', 'phone', 'address', 'city', 'country', 'created', 'status', 'action'];

  panelOpenState = false;
  customersData: any = []

  constructor(

  ) {

  }

  ngOnInit(): void {
    // this.setValues();
  }

  ngAfterViewInit(): void {
    this.customersDataSource.paginator = this.paginator;
    this.customersDataSource.sort = this.sort;
  }


  // filter apply
  filterApply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customersDataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  setValues() {
    this.getCustomerDetails();
  }

  getCustomerDetails(customerId?: any) {
    const reqData = {
      customerId: customerId
    }
    this.loader.startLoader();
    this.peoplesService.getCustomerDetails(reqData).subscribe({
      next: (res: any) => {
        this.loader.stopLoader();
        // this.categoriesData = res?.data;
        console.log('Data', res?.data);

        if (Array.isArray(res?.data)) {
          this.customersData = res?.data;
        } else {
          const categoryExists = this.customersData.some(
            (category: any) => category.categoryCode == res?.data.categoryCode
          );
          if (!categoryExists) {
            this.customersData.push(res?.data);
          }
        }
        console.log('customersData', this.customersData);
        console.log('customersDataSource', this.customersDataSource.data);
        // this.loader.stopLoader();
        // this.cd.openSuccessModal('Successful !');
        this.customersDataSource.data = [...this.customersData];
      },
      error: (err: any) => {
        this.loader.stopLoader();
        this.cd.openErrorModal('CONNECTION_TIME_OUT', 'Error');
      }
    });
  }

  addCustomer(id: any) {
    const dialogRef = this.dialog.open(CreateCustomerDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.peoplesService?.customerCast?.pipe(first()).subscribe((data: any) => {
        console.log('Data', data);

        if (Array.isArray(data)) {
          this.customersData = data;
        } else {
          const customerExists = this.customersData.some(
            (customer: any) => customer.customerId == data.customerId
          );
          if (!customerExists) {
            this.customersData.push(data);
          }
        }
        console.log('customersData', this.customersData);
        console.log('customersDataSource', this.customersDataSource.data);
        this.loader.stopLoader();
        this.cd.openSuccessModal('Successful !');
        this.customersDataSource.data = [...this.customersData];
      });
    });
  }

  editCustomer(index: number, id: any) {
    const selectedCustomer = this.customersData[index];
    const dialogRef = this.dialog.open(CreateCustomerDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id,
        customer: selectedCustomer,
        index: index
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      this.peoplesService?.customerCast?.pipe(first()).subscribe((updatedCustomer: any) => {
        this.customersData = [];
        if (Array.isArray(updatedCustomer)) {
          this.customersData = updatedCustomer;
        } else {
          const customerExists = this.customersData.some(
            (customer: any) => customer.customerId == updatedCustomer.customerId
          );
          if (!customerExists) {
            this.customersData.push(updatedCustomer);
          }
        }

        this.customersDataSource.data[data.index] = updatedCustomer;
        this.customersDataSource._updateChangeSubscription();
        this.loader.stopLoader();
        this.cd.openSuccessModal('Successful !');
      });
    });
  }

  deleteCustomer(index: number) {
    this.cd.openConfirmModal('Are you sure you want to delete this customer?', () => {
      this.customersData.splice(index, 1);
      this.customersDataSource.data = [...this.customersData];
      this.customersDataSource._updateChangeSubscription();
    });
  }
}
