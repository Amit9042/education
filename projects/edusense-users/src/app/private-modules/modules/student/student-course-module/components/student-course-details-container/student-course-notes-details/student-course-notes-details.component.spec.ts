import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseNotesDetailsComponent } from './student-course-notes-details.component';

describe('StudentCourseNotesDetailsComponent', () => {
  let component: StudentCourseNotesDetailsComponent;
  let fixture: ComponentFixture<StudentCourseNotesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCourseNotesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseNotesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
