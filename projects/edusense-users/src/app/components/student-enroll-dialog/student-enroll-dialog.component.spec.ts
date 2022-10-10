import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollDialogComponent } from './student-enroll-dialog.component';

describe('StudentEnrollDialogComponent', () => {
  let component: StudentEnrollDialogComponent;
  let fixture: ComponentFixture<StudentEnrollDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEnrollDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEnrollDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
