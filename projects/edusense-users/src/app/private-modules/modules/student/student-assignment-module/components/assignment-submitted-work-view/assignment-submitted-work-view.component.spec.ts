import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmittedWorkViewComponent } from './assignment-submitted-work-view.component';

describe('AssignmentSubmittedWorkViewComponent', () => {
  let component: AssignmentSubmittedWorkViewComponent;
  let fixture: ComponentFixture<AssignmentSubmittedWorkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentSubmittedWorkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSubmittedWorkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
