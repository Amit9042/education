import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBookmarkQuestionComponent } from './student-bookmark-question.component';

describe('StudentBookmarkQuestionComponent', () => {
  let component: StudentBookmarkQuestionComponent;
  let fixture: ComponentFixture<StudentBookmarkQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBookmarkQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBookmarkQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
