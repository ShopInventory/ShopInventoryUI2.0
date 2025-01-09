import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';

@Component({
  selector: 'app-generic-table',
  imports: [CommonModule, MaterialModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {
  @Input() dataSource: any = new MatTableDataSource<any>();  // The data to display in the table
  @Input() displayedColumns: string[] = [];  // The columns to display
  @Input() columnDefs: any[] = []; // Column definitions with label, field, type
  @Output() editEvent = new EventEmitter<any>();  // Event for edit action
  @Output() deleteEvent = new EventEmitter<any>();  // Event for delete action

  onEdit(index: any) {
    console.log('Edit index', index);

    this.editEvent.emit(index);
  }

  onDelete(index: any) {
    this.deleteEvent.emit(index);
  }
}
