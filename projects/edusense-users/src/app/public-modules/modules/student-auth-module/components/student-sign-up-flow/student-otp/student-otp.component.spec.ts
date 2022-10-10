import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOtpComponent } from './student-otp.component';

describe('StudentOtpComponent', () => {
  let component: StudentOtpComponent;
  let fixture: ComponentFixture<StudentOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
