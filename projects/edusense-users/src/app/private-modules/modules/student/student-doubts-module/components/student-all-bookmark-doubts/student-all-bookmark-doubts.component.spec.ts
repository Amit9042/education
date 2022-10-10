import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAllBookmarkDoubtsComponent } from './student-all-bookmark-doubts.component';

describe('StudentAllBookmarkDoubtsComponent', () => {
  let component: StudentAllBookmarkDoubtsComponent;
  let fixture: ComponentFixture<StudentAllBookmarkDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAllBookmarkDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAllBookmarkDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
