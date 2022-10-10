import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubjectSelectionComponent } from './student-subject-selection.component';

describe('StudentSubjectSelectionComponent', () => {
  let component: StudentSubjectSelectionComponent;
  let fixture: ComponentFixture<StudentSubjectSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSubjectSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSubjectSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
