import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseDetailsContainerComponent } from './student-course-details-container.component';

describe('StudentCourseDetailsContainerComponent', () => {
  let component: StudentCourseDetailsContainerComponent;
  let fixture: ComponentFixture<StudentCourseDetailsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCourseDetailsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
