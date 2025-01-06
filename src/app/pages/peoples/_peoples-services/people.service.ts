import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeoplesService {


  private customer = new Subject<any>();
  private supplier = new Subject<any>();

  customerCast = this.customer.asObservable();
  supplierCast = this.supplier.asObservable();

  constructor(

  ) { }

  addCustomer(data: any) {
    this.customer.next(data);
    return this.customerCast;  // Return the observable
  }

  addSupplier(data: any) {
    this.supplier.next(data);
  }

  getCustomerDetails(data: any) {
    return data
    // return this.http.post(shopInventoryEndpoints.getCategoryDetails, data);
  }
}
