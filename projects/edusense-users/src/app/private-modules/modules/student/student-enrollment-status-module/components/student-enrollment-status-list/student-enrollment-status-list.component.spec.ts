import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollmentstatusListComponent } from './student-enrollment-status-list.component';

describe('StudentEnrollmentstatusListComponent', () => {
  let component: StudentEnrollmentstatusListComponent;
  let fixture: ComponentFixture<StudentEnrollmentstatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEnrollmentstatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEnrollmentstatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
