import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuestionAnswerComponent } from './student-question-answer.component';

describe('StudentQuestionAnswerComponent', () => {
  let component: StudentQuestionAnswerComponent;
  let fixture: ComponentFixture<StudentQuestionAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentQuestionAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
