import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRecordedViewComponent } from './student-recorded-view.component';

describe('StudentRecordedViewComponent', () => {
  let component: StudentRecordedViewComponent;
  let fixture: ComponentFixture<StudentRecordedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRecordedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRecordedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
