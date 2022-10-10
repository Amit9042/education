import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPracticeReportListComponent } from './student-practice-report-list.component';

describe('StudentPracticeReportListComponent', () => {
  let component: StudentPracticeReportListComponent;
  let fixture: ComponentFixture<StudentPracticeReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPracticeReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPracticeReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
