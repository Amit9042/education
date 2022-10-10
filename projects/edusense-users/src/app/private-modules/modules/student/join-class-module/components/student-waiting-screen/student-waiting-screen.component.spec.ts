import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWaitingScreenComponent } from './student-waiting-screen.component';

describe('StudentWaitingScreenComponent', () => {
  let component: StudentWaitingScreenComponent;
  let fixture: ComponentFixture<StudentWaitingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentWaitingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentWaitingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
