import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuestionBankPracticeDialogComponent } from './select-question-bank-practice-dialog.component';

describe('SelectQuestionBankPracticeDialogComponent', () => {
  let component: SelectQuestionBankPracticeDialogComponent;
  let fixture: ComponentFixture<SelectQuestionBankPracticeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectQuestionBankPracticeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectQuestionBankPracticeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
