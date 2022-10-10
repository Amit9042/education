import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentCheckDialogComponent } from './assignment-check-dialog.component';

describe('AssignmentCheckDialogComponent', () => {
  let component: AssignmentCheckDialogComponent;
  let fixture: ComponentFixture<AssignmentCheckDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentCheckDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentCheckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
