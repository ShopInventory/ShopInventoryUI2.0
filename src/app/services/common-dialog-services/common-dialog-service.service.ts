import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogContentComponent } from '../../shared/shared-component/common-dialog-content/common-dialog-content.component';

@Injectable({
  providedIn: 'root'
})
export class CommonDialogService {

  constructor(
    public dialog: MatDialog,

  ) { }


  openConfirmModal(msg: any, callbackFn: any = null, callbackFnNo: any = null, config: any = null) {
    const currentDialog = this.dialog.open(CommonDialogContentComponent, {
      panelClass: 'small-dialog',
      autoFocus: false,
      data: {
        dialogText: msg,
        id: 'confirm-modal',
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (res.action === 'Yes') {
        if (typeof callbackFn == 'function') {
          callbackFn();
        }
      } else {
        if (typeof callbackFnNo == 'function') {
          callbackFnNo();
        }
      }
    });
  }
  openConsentConfirmModal(msg: any, callbackFn: any = null, callbackFnNo: any = null, config: any = null) {
    const currentDialog = this.dialog.open(CommonDialogContentComponent, {
      panelClass: 'small-dialog',
      autoFocus: false,
      data: {
        dialogText: msg,
        id: 'confirm-modal-with-warning',
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (res.action === 'Yes') {
        if (typeof callbackFn == 'function') {
          callbackFn();
        }
      } else {
        if (typeof callbackFnNo == 'function') {
          callbackFnNo();
        }
      }
    });
  }

  openSuccessModal(msg: any, callbackFn: any = null, config: any = null) {
    const currentDialog = this.dialog.open(CommonDialogContentComponent, {
      panelClass: 'small-dialog',
      autoFocus: false,
      data: {
        dialogText: msg,
        id: 'successful',
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (typeof callbackFn == 'function') {
        callbackFn();
      }
    });
  }

  openErrorModal(error: any, title: any = null, callbackFn: any = null, config: any = null) {
    const currentDialog = this.dialog.open(CommonDialogContentComponent, {
      panelClass: 'small-dialog',
      autoFocus: false,
      data: {
        dialogText: error,
        id: 'failed',
        title: title,
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (typeof callbackFn == 'function') {
        callbackFn();
      }
    });
  }
}
