import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskDoubtSelectSubjectComponent } from './ask-doubt-select-subject.component';

describe('AskDoubtSelectSubjectComponent', () => {
  let component: AskDoubtSelectSubjectComponent;
  let fixture: ComponentFixture<AskDoubtSelectSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskDoubtSelectSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskDoubtSelectSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
