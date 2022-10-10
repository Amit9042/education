import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentForgotPasswordFlowContainerComponent } from './student-forgot-password-flow-container.component';

describe('StudentForgotPasswordFlowContainerComponent', () => {
  let component: StudentForgotPasswordFlowContainerComponent;
  let fixture: ComponentFixture<StudentForgotPasswordFlowContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentForgotPasswordFlowContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentForgotPasswordFlowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
