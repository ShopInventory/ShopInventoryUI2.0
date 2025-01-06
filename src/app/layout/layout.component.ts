import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '../shared/shared-module/material/material.module';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-layout',
    imports: [CommonModule, RouterOutlet, MaterialModule, SidenavComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  title = 'ShopInventoryUI';
  isMobile = false;
  sidenavOpened = false;


  collapsed = signal(false);

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,   // For extra small devices (mobile)
      Breakpoints.Small,    // For small devices (phones, small tablets)
      Breakpoints.Medium
    ]).subscribe(result => {
      this.isMobile = result.matches;

      if (!this.isMobile) {
        this.sidenavOpened = false; // Ensure sidenav is closed for larger screens
      }
    });
  }

  // toggleSidenav() {
  //   console.log('sidenavOpened:', this.sidenavOpened);
  //   console.log('Toggled collapsed state :', this.collapsed());

  //   this.sidenavOpened = !this.sidenavOpened;
  //   this.collapsed.set(!this.sidenavOpened);
  // }

  toggleSidenav() {
    // Toggle the sidenav state
    this.sidenavOpened = !this.sidenavOpened;

    // Synchronize the collapsed signal
    this.collapsed.set(!this.sidenavOpened);

    console.log('sidenavOpened:', this.sidenavOpened);
    console.log('Toggled collapsed state:', this.collapsed());
  }

  onMenuItemSelected() {
    if (this.isMobile) {
      // Close sidenav only for mobile devices
      this.sidenavOpened = false;
      this.collapsed.set(true);
      console.log('Sidenav closed after menu item click on mobile');
    }
  }

  toggleCollapsed() {
    const newState = !this.collapsed();
    this.collapsed.set(newState);
    console.log('Toggled collapsed state to:', newState);
  }

  menuClick(newState: boolean) {
    this.collapsed.set(newState);  // Update the signal state
    console.log('Collapsed state:', this.collapsed());

  }
}
