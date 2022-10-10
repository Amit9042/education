import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListLeftComponent } from './question-list-left.component';

describe('QuestionListLeftComponent', () => {
  let component: QuestionListLeftComponent;
  let fixture: ComponentFixture<QuestionListLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionListLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
