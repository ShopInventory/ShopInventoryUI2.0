import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { map, scan, Subject } from 'rxjs';
import { LoaderComponent } from 'src/app/shared/shared-component/loader/loader.component';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private spinnerTopRef: OverlayRef | null = null; // Explicitly type as OverlayRef or null
  private isLoading: boolean = false;

  spin$: Subject<boolean> = new Subject();

  constructor(private overlay: Overlay) {
    this.spin$
      ?.asObservable()
      ?.pipe(
        map((val) => (val ? 1 : -1)),
        scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
      )
      .subscribe((res) => {
        if (res === 1) {
          this.showSpinner();
        } else if (res == 0) {
          this.spinnerTopRef?.hasAttached() ? this.stopSpinner() : null;
        }
      });
  }

  private cdkSpinnerCreate() {
    // Create spinnerTopRef only when needed
    console.log('Creating Overlay');
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }

  private showSpinner() {
    if (!this.spinnerTopRef?.hasAttached()) {
      this.spinnerTopRef = this.cdkSpinnerCreate(); // Initialize only when needed
      this.spinnerTopRef?.attach(new ComponentPortal(LoaderComponent));
      this.isLoading = true;
    }
  }

  private stopSpinner() {
    if (this.spinnerTopRef?.hasAttached()) {
      this.spinnerTopRef?.detach();
      this.isLoading = false;
    }
  }

  public startLoader() {
    if (!this.isLoading) {
      this.spin$?.next(true);
    }
  }

  public stopLoader() {
    this.spin$?.next(false);
  }
}
