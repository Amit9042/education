import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSignUpContainerComponent } from './student-sign-up-container.component';

describe('StudentSignUpContainerComponent', () => {
  let component: StudentSignUpContainerComponent;
  let fixture: ComponentFixture<StudentSignUpContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSignUpContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSignUpContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
