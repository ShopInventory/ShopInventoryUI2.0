import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubCategoryDialogComponent } from './create-sub-category-dialog.component';

describe('CreateSubCategoryDialogComponent', () => {
  let component: CreateSubCategoryDialogComponent;
  let fixture: ComponentFixture<CreateSubCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
