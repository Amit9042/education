import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSelectionComponent } from './subject-selection.component';

describe('SubjectSelectionComponent', () => {
  let component: SubjectSelectionComponent;
  let fixture: ComponentFixture<SubjectSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
