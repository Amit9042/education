import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSelectionComponent } from './grade-selection.component';

describe('GradeSelectionComponent', () => {
  let component: GradeSelectionComponent;
  let fixture: ComponentFixture<GradeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
