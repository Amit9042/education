import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentForgotOtpComponent } from './student-forgot-otp.component';

describe('StudentForgotOtpComponent', () => {
  let component: StudentForgotOtpComponent;
  let fixture: ComponentFixture<StudentForgotOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentForgotOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentForgotOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
