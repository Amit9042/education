import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubjectPracticeComponent } from './choose-subject-practice.component';

describe('ChooseSubjectPracticeComponent', () => {
  let component: ChooseSubjectPracticeComponent;
  let fixture: ComponentFixture<ChooseSubjectPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubjectPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubjectPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
