import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStreamingComponent } from './student-streaming.component';

describe('StudentStreamingComponent', () => {
  let component: StudentStreamingComponent;
  let fixture: ComponentFixture<StudentStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
