import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPracticeReportViewDialogComponent } from './student-practice-report-view-dialog.component';

describe('StudentPracticeReportViewDialogComponent', () => {
  let component: StudentPracticeReportViewDialogComponent;
  let fixture: ComponentFixture<StudentPracticeReportViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPracticeReportViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPracticeReportViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
