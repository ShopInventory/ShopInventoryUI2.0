import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

export const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'suppliers', component: SuppliersComponent },
];
