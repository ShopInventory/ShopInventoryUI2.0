import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'inventory',
    // loadChildren: () => import('./pages/inventory/inventory.routes').then((m) => m.routes),
    loadChildren: () => import('./pages/inventory/inventory.routes').then((m) => m.routes)
  },
  {
    path: 'peoples',
    loadChildren: () => import('./pages/peoples/people.routes').then((m) => m.routes),
  },
  {
    path: 'authentication',
    loadChildren: () => import('./pages/authentication/auth.routes').then((m) => m.routes),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
];

