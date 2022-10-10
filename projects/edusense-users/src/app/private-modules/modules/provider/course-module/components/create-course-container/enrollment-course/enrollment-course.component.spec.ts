import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentCourseComponent } from './enrollment-course.component';

describe('EnrollmentCourseComponent', () => {
  let component: EnrollmentCourseComponent;
  let fixture: ComponentFixture<EnrollmentCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
