import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRecordedListComponent } from './student-recorded-list.component';

describe('StudentRecordedListComponent', () => {
  let component: StudentRecordedListComponent;
  let fixture: ComponentFixture<StudentRecordedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRecordedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRecordedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
