import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { CreateCategoryDialogComponent } from '../_inventory-common-dialog/create-category-dialog/create-category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InventoryService } from '../_inventory-services/inventory.service';
import { LoaderService } from '@services/loader/loader.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, MaterialModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categoriesDataSource = new MatTableDataSource<any>();
  categoriesDisplayedColumns: string[] = ['srNo', 'categoryName', 'categoryCode', 'created', 'status', 'action'];

  panelOpenState = false;
  categoriesData: any = []

  readonly dialog = inject(MatDialog);
  readonly inventoryService = inject(InventoryService);
  readonly loader = inject(LoaderService);
  readonly cd = inject(CommonDialogService);


  ngOnInit(): void {
    // this.setValues();
  }

  ngAfterViewInit(): void {
    this.categoriesDataSource.paginator = this.paginator;
    this.categoriesDataSource.sort = this.sort;
  }

  // filter apply
  filterApply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoriesDataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  setValues() {
    this.getCategoryDetails();
  }

  getCategoryDetails(categoryId?: any) {
    const reqData = {
      categoryId: categoryId
    }
    this.loader.startLoader();
    this.inventoryService.getCategoryDetails(reqData).subscribe({
      next: (res: any) => {
        this.loader.stopLoader();
        // this.categoriesData = res?.data;
        console.log('Data', res?.data);

        if (Array.isArray(res?.data)) {
          this.categoriesData = res?.data;
        } else {
          const categoryExists = this.categoriesData.some(
            (category: any) => category.categoryCode == res?.data.categoryCode
          );
          if (!categoryExists) {
            this.categoriesData.push(res?.data);
          }
        }
        console.log('categoriesData', this.categoriesData);
        console.log('categoriesDataSource', this.categoriesDataSource.data);
        // this.loader.stopLoader();
        // this.cd.openSuccessModal('Successful !');
        this.categoriesDataSource.data = [...this.categoriesData];
      },
      error: (err) => {
        this.loader.stopLoader();
        this.cd.openErrorModal('CONNECTION_TIME_OUT', 'Error');
      }
    });
  }

  addCategory(id: any) {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      console.log('Datares', res);
      // this.inventoryService?.categoryCast?.pipe(first()).subscribe((data: any) => {
      //   console.log('Data', data);

      //   if (Array.isArray(data)) {
      //     this.categoriesData = data;
      //   } else {
      //     const categoryExists = this.categoriesData.some(
      //       (category: any) => category.categoryCode == data.categoryCode
      //     );
      //     if (!categoryExists) {
      //       this.categoriesData.push(data);
      //     }
      //   }
      //   console.log('categoriesData', this.categoriesData);
      //   console.log('categoriesDataSource', this.categoriesDataSource.data);
      //   this.loader.stopLoader();
      //   this.cd.openSuccessModal('Successful !');
      //   this.categoriesDataSource.data = [...this.categoriesData];
      // });
      this.getCategoryDetails();
    });
  }

  editCategory(index: number, id: any) {
    const selectedCategory = this.categoriesData[index];
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id,
        category: selectedCategory,
        index: index
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      this.inventoryService?.categoryCast?.pipe(first()).subscribe((updatedCategory: any) => {
        this.categoriesData = [];
        if (Array.isArray(updatedCategory)) {
          this.categoriesData = updatedCategory;
        } else {
          const categoryExists = this.categoriesData.some(
            (category: any) => category.categoryCode == updatedCategory.categoryCode
          );
          if (!categoryExists) {
            this.categoriesData.push(updatedCategory);
          }
        }
        this.categoriesDataSource.data[data.index] = updatedCategory;
        // this.categoriesDataSource.data = [...this.categoriesDataSource.data];
        this.categoriesDataSource._updateChangeSubscription();
        this.loader.stopLoader();
        this.cd.openSuccessModal('Successful !');
      });
    });
  }

  deleteCategory(index: number) {
    this.cd.openConfirmModal('Are you sure you want to delete this category?', () => {
      this.categoriesData.splice(index, 1);
      this.categoriesDataSource.data = [...this.categoriesData];
      this.categoriesDataSource._updateChangeSubscription();
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
}
