import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBankQueListComponent } from './question-bank-que-list.component';

describe('QuestionBankQueListComponent', () => {
  let component: QuestionBankQueListComponent;
  let fixture: ComponentFixture<QuestionBankQueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBankQueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBankQueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
