import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPreviewRightComponent } from './question-preview-right.component';

describe('QuestionPreviewRightComponent', () => {
  let component: QuestionPreviewRightComponent;
  let fixture: ComponentFixture<QuestionPreviewRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPreviewRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPreviewRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
