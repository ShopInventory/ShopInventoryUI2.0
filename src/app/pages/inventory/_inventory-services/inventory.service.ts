import { Injectable } from '@angular/core';
import { shopInventoryEndpoints } from '@constants/endpoints/shopInventoryEndpoints';
import { environment } from '@environments/environment';
import { HttpApiService } from '@services/http-api/http-api.service';
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  enableMock: boolean = false;

  private product = new Subject<any>();
  private category = new Subject<any>();
  private subCategory = new Subject<any>();
  private brand = new Subject<any>();

  productCast = this.product.asObservable();
  categoryCast = this.category.asObservable();
  subCategoryCast = this.subCategory.asObservable();
  brandCast = this.brand.asObservable();

  constructor(
    private http: HttpApiService
  ) { }


  addProduct(data: any) {
    this.product.next(data);
  }

  addCategory(data: any) {
    this.category.next(data);
  }

  addSubCategory(data: any) {
    this.subCategory.next(data);
  }

  addBrand(data: any) {
    this.brand.next(data);
  }

  saveBrandDetails(data: any) {
    return this.http.post(shopInventoryEndpoints.saveBrandDetails, data);
  }

  saveCategoryDetails(data: any) {
    return this.http.post(shopInventoryEndpoints.saveCategoryDetails, data);
  }

  getCategoryDetails(data: any) {
    return this.http.post(shopInventoryEndpoints.getCategoryDetails, data);
  }

  getBrandDetails(data: any) {
    return this.http.post(shopInventoryEndpoints.getBrandDetails, data);
  }
}
