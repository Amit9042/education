import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentCompletedViewComponent } from './assignment-completed-view.component';

describe('AssignmentCompletedViewComponent', () => {
  let component: AssignmentCompletedViewComponent;
  let fixture: ComponentFixture<AssignmentCompletedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentCompletedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentCompletedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
