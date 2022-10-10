import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListSidebarComponent } from './question-list-sidebar.component';

describe('QuestionListSidebarComponent', () => {
  let component: QuestionListSidebarComponent;
  let fixture: ComponentFixture<QuestionListSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionListSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
