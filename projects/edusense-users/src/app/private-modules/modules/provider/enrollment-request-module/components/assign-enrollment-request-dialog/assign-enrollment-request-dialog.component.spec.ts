import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEnrollmentRequestDialogComponent } from './assign-enrollment-request-dialog.component';

describe('AssignEnrollmentRequestDialogComponent', () => {
  let component: AssignEnrollmentRequestDialogComponent;
  let fixture: ComponentFixture<AssignEnrollmentRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEnrollmentRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEnrollmentRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
