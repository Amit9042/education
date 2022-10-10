import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseAboutDetailsComponent } from './student-course-about-details.component';

describe('StudentCourseAboutDetailsComponent', () => {
  let component: StudentCourseAboutDetailsComponent;
  let fixture: ComponentFixture<StudentCourseAboutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCourseAboutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseAboutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
