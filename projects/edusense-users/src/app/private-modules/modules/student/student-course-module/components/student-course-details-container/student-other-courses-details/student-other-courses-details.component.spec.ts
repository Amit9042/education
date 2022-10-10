import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOtherCoursesDetailsComponent } from './student-other-courses-details.component';

describe('StudentOtherCoursesDetailsComponent', () => {
  let component: StudentOtherCoursesDetailsComponent;
  let fixture: ComponentFixture<StudentOtherCoursesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentOtherCoursesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOtherCoursesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
