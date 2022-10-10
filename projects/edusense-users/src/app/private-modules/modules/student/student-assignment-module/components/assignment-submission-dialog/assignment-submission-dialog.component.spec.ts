import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmissionDialogComponent } from './assignment-submission-dialog.component';

describe('AssignmentSubmissionDialogComponent', () => {
  let component: AssignmentSubmissionDialogComponent;
  let fixture: ComponentFixture<AssignmentSubmissionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentSubmissionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
