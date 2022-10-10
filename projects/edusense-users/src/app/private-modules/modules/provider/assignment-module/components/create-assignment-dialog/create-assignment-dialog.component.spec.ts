import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssignmentDialogComponent } from './create-assignment-dialog.component';

describe('CreateAssignmentDialogComponent', () => {
  let component: CreateAssignmentDialogComponent;
  let fixture: ComponentFixture<CreateAssignmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssignmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
