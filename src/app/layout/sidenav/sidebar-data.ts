import { signal } from '@angular/core';
import { NavItem } from "./nav-item-data";

export const navItems = signal<NavItem[]>([
  {
    navCap: 'Home',
    navIcon: 'bi bi-house',
    children: [
      {
        displayName: 'Dashboard',
        iconName: 'bi bi-columns-gap',
        route: '/dashboard',
      }
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Inventory',
    navIcon: 'bi bi-box-seam',
    children: [
      {
        displayName: 'Products',
        iconName: 'bi bi-box',
        route: '/inventory/products',
      },
      {
        displayName: 'Category',
        iconName: 'bi bi-boxes',
        route: '/inventory/categories',
      },
      {
        displayName: 'Sub Category',
        iconName: 'bi bi-box2',
        route: '/inventory/sub-categories',
      },
      {
        displayName: 'Brands',
        iconName: 'bi bi-tags',
        route: '/inventory/brands',
      },
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Purchases',
    navIcon: 'bi bi-cart-plus',
    children: [
      {
        displayName: 'Purchase',
        iconName: 'bi bi-cart-plus',
        route: '/ui-components/chips',
      }
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Sales',
    navIcon: 'bi bi-cart',
    children: [
      {
        displayName: 'Sales',
        iconName: 'bi bi-cart',
        route: '/ui-components/lists',
      },
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Stock',
    navIcon: 'bi bi-box-seam',
    children: [
      {
        displayName: 'Manage Stocks',
        iconName: 'bi bi-box-seam',
        route: '/ui-components/lists',
      },
      {
        displayName: 'Sales',
        iconName: 'bi bi-cart-dash',
        route: '/ui-components/lists',
      },
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Peoples',
    navIcon: 'bi bi-people',
    children: [
      {
        displayName: 'Customers',
        iconName: 'bi bi-people',
        route: '/peoples/customers',
      },
      {
        displayName: 'Suppliers',
        iconName: 'bi bi-person-down',
        route: '/peoples/suppliers',
      }
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Reports',
    navIcon: 'bi bi-file-earmark-bar-graph',
    children: [
      {
        displayName: 'Purchase',
        iconName: 'bi bi-file-earmark-bar-graph',
        route: '/ui-components/expansion',
      },
      {
        displayName: 'Sales',
        iconName: 'bi bi-bar-chart-line',
        route: '/ui-components/divider',
      },
      {
        displayName: 'Customer Dues',
        iconName: 'bi bi-people',
        route: '/ui-components/menu',
      }
    ],
    panelOpenState: false, // Initialize panelOpenState
  },
  {
    navCap: 'Auth',
    navIcon: 'bi bi-box-arrow-in-right',
    children: [
      {
        displayName: 'Login',
        iconName: 'bi bi-box-arrow-in-right',
        route: '/authentication/login',
      },
      {
        displayName: 'Register',
        iconName: 'bi-person-plus',
        route: '/authentication/register',
      }
    ],
    panelOpenState: false, // Initialize panelOpenState
  }
]);

export const settingItems = signal<NavItem[]>([
  {
    navCap: 'Settings',
    navIcon: 'bi bi-gear',
    children: [
      {
        displayName: 'General',
        iconName: 'bi bi-gear',
        route: '/ui-components/tooltips',
      },
      {
        displayName: 'Logout',
        iconName: 'bi bi-box-arrow-right',
        route: '/authentication/login',
      },
    ],
    panelOpenState: false, // Initialize panelOpenState
  }
]);
