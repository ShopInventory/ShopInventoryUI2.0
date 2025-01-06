import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupplierDialogComponent } from './create-supplier-dialog.component';

describe('CreateSupplierDialogComponent', () => {
  let component: CreateSupplierDialogComponent;
  let fixture: ComponentFixture<CreateSupplierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSupplierDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSupplierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
