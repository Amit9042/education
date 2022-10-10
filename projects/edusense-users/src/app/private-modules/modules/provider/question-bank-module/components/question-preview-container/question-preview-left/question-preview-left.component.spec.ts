import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPreviewLeftComponent } from './question-preview-left.component';

describe('QuestionPreviewLeftComponent', () => {
  let component: QuestionPreviewLeftComponent;
  let fixture: ComponentFixture<QuestionPreviewLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPreviewLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPreviewLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
