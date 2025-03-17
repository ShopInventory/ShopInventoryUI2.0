import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';

@Component({
  selector: 'app-generic-table',
  imports: [CommonModule, MaterialModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() dataSource: any = new MatTableDataSource<any>();  // The data to display in the table
  @Input() displayedColumns: string[] = [];  // The columns to display
  @Input() columnDefs: any[] = []; // Column definitions with label, field, type
  @Output() editEvent = new EventEmitter<any>();  // Event for edit action
  @Output() deleteEvent = new EventEmitter<any>();  // Event for delete action

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('Sort initialized:', this.dataSource.sort);
    }
  }

  onEdit(row: any) {
    console.log('Edit row', row);

    this.editEvent.emit(row);
  }

  onDelete(index: any) {
    this.deleteEvent.emit(index);
  }
}
