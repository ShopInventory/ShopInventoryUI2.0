import { Component, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
import { navItems, settingItems } from './sidebar-data';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/shared-module/material/material.module';
import { Router } from '@angular/router';
import { NavItem } from "./nav-item-data";
import { MatExpansionPanel } from '@angular/material/expansion';


@Component({
    selector: 'app-sidenav',
    imports: [CommonModule, MaterialModule],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  // Accept the signal itself, not its value
  @Input() collapsed!: Signal<boolean>; // Define collapsed as a Signal<boolean>
  @Output() collapsedChanged = new EventEmitter<boolean>(); // EventEmitter to notify parent
  @ViewChild('expansionPanel') expansionPanel!: MatExpansionPanel;
  @ViewChild('navCap') navCap!: ElementRef;
  @Output() itemSelected = new EventEmitter<void>();

  panelOpenState = false;

  isExpanded: boolean = false;

  imgWidth: any = 100;
  imgHeight: any = 100;
  navItems = navItems; // Use the signal directly
  settingItems = settingItems; // Use the signal directly
  activeChild: any; // Variable to track the active child


  constructor(public router: Router) { }

  toggleCollapsedState(newState: boolean) {
    this.collapsedChanged.emit(newState);  // Emit new state to parent
  }

  onItemSelected(item: NavItem) {
    console.log('item', item);

    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      this.itemSelected.emit(); // Emit event to close the sidenav
      this.activeChild = item; // Set the active child

    }
  }

  onPanelOpened(item: any) {
    if (this.collapsed()) {
      this.toggleCollapsedState(false); // Open the sidebar
    }
    // Close all other panels
    this.navItems.update((items) =>
      items.map((navItem) => ({
        ...navItem,
        panelOpenState: navItem === item ? !navItem.panelOpenState : false, // Toggle clicked panel, close others
      }))
    );
  }
}
