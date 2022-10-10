import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmissionViewComponent } from './assignment-submission-view.component';

describe('AssignmentSubmissionViewComponent', () => {
  let component: AssignmentSubmissionViewComponent;
  let fixture: ComponentFixture<AssignmentSubmissionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentSubmissionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSubmissionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
