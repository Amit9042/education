import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmissionListViewComponent } from './assignment-submission-list-view.component';

describe('AssignmentSubmissionListViewComponent', () => {
  let component: AssignmentSubmissionListViewComponent;
  let fixture: ComponentFixture<AssignmentSubmissionListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentSubmissionListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSubmissionListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
