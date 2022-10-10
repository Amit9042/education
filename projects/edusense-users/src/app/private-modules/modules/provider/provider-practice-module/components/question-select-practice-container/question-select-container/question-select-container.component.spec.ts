import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSelectContainerComponent } from './question-select-container.component';

describe('QuestionSelectContainerComponent', () => {
  let component: QuestionSelectContainerComponent;
  let fixture: ComponentFixture<QuestionSelectContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSelectContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSelectContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
