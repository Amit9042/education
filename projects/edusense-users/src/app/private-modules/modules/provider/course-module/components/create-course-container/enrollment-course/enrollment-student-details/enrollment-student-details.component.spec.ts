import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentStudentDetailsComponent } from './enrollment-student-details.component';

describe('EnrollmentStudentDetailsComponent', () => {
  let component: EnrollmentStudentDetailsComponent;
  let fixture: ComponentFixture<EnrollmentStudentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentStudentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentStudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
