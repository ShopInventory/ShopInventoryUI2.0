import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';
import { CreateProductDialogComponent } from '../_inventory-common-dialog/create-product-dialog/create-product-dialog.component';
import { first } from 'rxjs';
import { InventoryService } from '../_inventory-services/inventory.service';
import { LoaderService } from '@services/loader/loader.service';
import { CommonDialogService } from '@services/common-dialog-services/common-dialog-service.service';

@Component({
    selector: 'app-products',
    imports: [CommonModule, MaterialModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productDataSource = new MatTableDataSource<any>();
  productDisplayedColumns: string[] = ['srNo', 'productName', 'productType', 'productCategory', 'productSubCategory', 'productBrand', 'productUnit', 'productQty', 'created', 'action'];

  panelOpenState = false;
  productData: any = [];

  readonly dialog = inject(MatDialog);
  readonly inventoryService = inject(InventoryService);
  readonly loader = inject(LoaderService);
  readonly cd = inject(CommonDialogService);

  constructor(

  ) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.productDataSource.paginator = this.paginator;
    this.productDataSource.sort = this.sort;
  }


  // filter apply
  filterApply(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  addProduct(id: any) {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      panelClass: 'large-dialog',
      autoFocus: false,
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      console.log('res', res)
      console.log('enableMock Value', this.inventoryService?.enableMock);
      this.inventoryService?.productCast?.pipe(first()).subscribe((data: any) => {
        if (Array.isArray(data)) {
          this.productData = data;
        } else {
          const productExists = this.productData.some(
            (product: any) => product.productSku == data.productSku
          );
          if (!productExists) {
            this.productData.push(data);
          }
        }
        console.log('productData', this.productData);
        console.log('productDataSource', this.productDataSource.data);
        setTimeout(() => {
          // this.loader.stopLoader();
          this.productDataSource.data = [...this.productData];
        }, 2000);
      });
    });
  }


    editProduct(index: number, id: any) {
      const selectedProduct = this.productData[index];
      const dialogRef = this.dialog.open(CreateProductDialogComponent, {
        panelClass: 'large-dialog',
        autoFocus: false,
        data: {
          id: id,
          product: selectedProduct,
          index: index
        },
      });

      dialogRef.afterClosed().subscribe((data: any) => {
        this.inventoryService?.productCast?.pipe(first()).subscribe((updatedProduct: any) => {
          this.productData = [];
          if (Array.isArray(updatedProduct)) {
            this.productData = updatedProduct;
          } else {
            const productExists = this.productData.some(
              (product: any) => product.productSku == updatedProduct.productSku
            );
            if (!productExists) {
              this.productData.push(updatedProduct);
            }
          }
          this.productDataSource.data[data.index] = updatedProduct;
          this.productDataSource._updateChangeSubscription();
          this.loader.stopLoader();
          this.cd.openSuccessModal('Successful !');
        });
      });
    }

  deleteProduct(index: number) {
    this.cd.openConfirmModal('Are you sure you want to delete this product?', () => {
      this.productData.splice(index, 1);
      this.productDataSource.data = [...this.productData];
      this.productDataSource._updateChangeSubscription();
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
