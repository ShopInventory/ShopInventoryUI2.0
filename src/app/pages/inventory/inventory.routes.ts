import { Routes } from '@angular/router';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';

export const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'sub-categories', component: SubCategoriesComponent },
  { path: 'brands', component: BrandsComponent },
];
