import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentForgotPasswordComponent } from './student-forgot-password.component';

describe('StudentForgotPasswordComponent', () => {
  let component: StudentForgotPasswordComponent;
  let fixture: ComponentFixture<StudentForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
