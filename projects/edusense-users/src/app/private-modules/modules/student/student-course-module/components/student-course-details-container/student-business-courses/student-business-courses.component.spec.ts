import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBusinessCoursesComponent } from './student-business-courses.component';

describe('StudentBusinessCoursesComponent', () => {
  let component: StudentBusinessCoursesComponent;
  let fixture: ComponentFixture<StudentBusinessCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBusinessCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBusinessCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
