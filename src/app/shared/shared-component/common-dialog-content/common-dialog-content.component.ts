import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared-module/material/material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-common-dialog-content',
    imports: [CommonModule, MaterialModule],
    templateUrl: './common-dialog-content.component.html',
    styleUrls: ['./common-dialog-content.component.scss']
})
export class CommonDialogContentComponent {
  //dialog data variables start
  id: any;
  title: any;
  dialogText: any;

  //dialog data variables end

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CommonDialogContentComponent>,
  ) {
    dialogRef.disableClose = true;
    this.id = data.id;
    this.title = data.title;
    this.dialogText = data.dialogText;
  }

  ngOnInit(): void {
    console.log('Common Dialog Content');

  }


  confirmModal(action: any) {
    this.dialogRef.close({
      action: action,
    });
  }

}


