import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDialogContentComponent } from './common-dialog-content.component';

describe('CommonDialogContentComponent', () => {
  let component: CommonDialogContentComponent;
  let fixture: ComponentFixture<CommonDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDialogContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
