import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAllDoubtsComponent } from './student-all-doubts.component';

describe('StudentAllDoubtsComponent', () => {
  let component: StudentAllDoubtsComponent;
  let fixture: ComponentFixture<StudentAllDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAllDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAllDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
