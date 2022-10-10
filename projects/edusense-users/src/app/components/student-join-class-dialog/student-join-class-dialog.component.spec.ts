import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJoinClassDialogComponent } from './student-join-class-dialog.component';

describe('StudentJoinClassDialogComponent', () => {
  let component: StudentJoinClassDialogComponent;
  let fixture: ComponentFixture<StudentJoinClassDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentJoinClassDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJoinClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
