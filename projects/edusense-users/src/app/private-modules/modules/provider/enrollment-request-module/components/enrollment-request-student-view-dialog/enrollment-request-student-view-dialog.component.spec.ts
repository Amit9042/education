import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentRequestStudentViewDialogComponent } from './enrollment-request-student-view-dialog.component';

describe('EnrollmentRequestStudentViewDialogComponent', () => {
  let component: EnrollmentRequestStudentViewDialogComponent;
  let fixture: ComponentFixture<EnrollmentRequestStudentViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentRequestStudentViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentRequestStudentViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
