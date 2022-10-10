import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseDiscussionDetailsComponent } from './student-course-discussion-details.component';

describe('StudentCourseDiscussionDetailsComponent', () => {
  let component: StudentCourseDiscussionDetailsComponent;
  let fixture: ComponentFixture<StudentCourseDiscussionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCourseDiscussionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseDiscussionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
