import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDetailsRightComponent } from './question-details-right.component';

describe('QuestionDetailsRightComponent', () => {
  let component: QuestionDetailsRightComponent;
  let fixture: ComponentFixture<QuestionDetailsRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionDetailsRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDetailsRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
