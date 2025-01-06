import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';
import { LoaderService } from '@services/loader/loader.service';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { InventoryService } from '../_inventory-services/inventory.service';
import { first } from 'rxjs';
import { CreateSubCategoryDialogComponent } from '../_inventory-common-dialog/create-sub-category-dialog/create-sub-category-dialog.component';

@Component({
  selector: 'app-sub-categories',
  imports: [CommonModule, MaterialModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.scss'
})
export class SubCategoriesComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subCategoriesDataSource = new MatTableDataSource<any>();
  subCategoriesDisplayedColumns: string[] = ['srNo', 'categoryId', 'subCategoryName', 'subCategoryCode', 'created', 'status', 'action'];

  panelOpenState = false;
  subCategoriesData: any = [];

  readonly dialog = inject(MatDialog);
  readonly inventoryService = inject(InventoryService);
  readonly loader = inject(LoaderService);
  readonly cd = inject(CommonDialogService);


  constructor(

  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.subCategoriesDataSource.paginator = this.paginator;
    this.subCategoriesDataSource.sort = this.sort;
  }


  // filter apply
  filterApply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.subCategoriesDataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  addSubCategory(id: any) {
    const dialogRef = this.dialog.open(CreateSubCategoryDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.inventoryService?.subCategoryCast?.pipe(first()).subscribe((data: any) => {
        console.log('Data', data);

        if (Array.isArray(data)) {
          this.subCategoriesData = data;
        } else {
          const subCategoryExists = this.subCategoriesData.some(
            (subCategory: any) => subCategory.subCategoryCode == data.subCategoryCode
          );
          if (!subCategoryExists) {
            this.subCategoriesData.push(data);
          }
        }
        console.log('subCategoriesData', this.subCategoriesData);
        console.log('subCategoriesDataSource', this.subCategoriesDataSource.data);
        this.loader.stopLoader();
        this.subCategoriesDataSource.data = [...this.subCategoriesData];
      });
    });
  }

  editSubCategory(index: number, id: any) {
    const selectedSubCategory = this.subCategoriesData[index];
    const dialogRef = this.dialog.open(CreateSubCategoryDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      data: {
        id: id,
        subCategory: selectedSubCategory,
        index: index
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      this.inventoryService?.subCategoryCast?.pipe(first()).subscribe((updatedSubCategory: any) => {
        this.subCategoriesData = [];
        if (Array.isArray(updatedSubCategory)) {
          this.subCategoriesData = updatedSubCategory;
        } else {
          const subCategoryExists = this.subCategoriesData.some(
            (subCategory: any) => subCategory.subCategoryCode == updatedSubCategory.subCategoryCode
          );
          if (!subCategoryExists) {
            this.subCategoriesData.push(updatedSubCategory);
          }
        }
        this.subCategoriesDataSource.data[data.index] = updatedSubCategory;
        this.subCategoriesDataSource._updateChangeSubscription();
        this.loader.stopLoader();
      });
    });
  }

  deleteSubCategory(index: number) {
    this.cd.openConfirmModal('Are you sure you want to delete this category?', () => {
      this.subCategoriesData.splice(index, 1);
      this.subCategoriesDataSource.data = [...this.subCategoriesData];
      this.subCategoriesDataSource._updateChangeSubscription();
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
