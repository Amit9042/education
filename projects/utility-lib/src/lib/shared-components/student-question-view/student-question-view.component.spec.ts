import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuestionViewComponent } from './student-question-view.component';

describe('StudentQuestionViewComponent', () => {
  let component: StudentQuestionViewComponent;
  let fixture: ComponentFixture<StudentQuestionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentQuestionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentQuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
