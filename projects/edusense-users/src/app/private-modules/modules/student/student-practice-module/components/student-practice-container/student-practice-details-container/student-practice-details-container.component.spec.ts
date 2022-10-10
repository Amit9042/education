import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPracticeDetailsContainerComponent } from './student-practice-details-container.component';

describe('StudentPracticeDetailsContainerComponent', () => {
  let component: StudentPracticeDetailsContainerComponent;
  let fixture: ComponentFixture<StudentPracticeDetailsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPracticeDetailsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPracticeDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
