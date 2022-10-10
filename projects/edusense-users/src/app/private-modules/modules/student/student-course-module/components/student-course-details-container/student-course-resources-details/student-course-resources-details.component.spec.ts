import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseResourcesDetailsComponent } from './student-course-resources-details.component';

describe('StudentCourseResourcesDetailsComponent', () => {
  let component: StudentCourseResourcesDetailsComponent;
  let fixture: ComponentFixture<StudentCourseResourcesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCourseResourcesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseResourcesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
