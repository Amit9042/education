import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseCategoriesComponent } from './student-course-categories.component';

describe('StudentCourseCategoriesComponent', () => {
  let component: StudentCourseCategoriesComponent;
  let fixture: ComponentFixture<StudentCourseCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCourseCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
