import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAttendanceListComponent } from './class-attendance-list.component';

describe('ClassAttendanceListComponent', () => {
  let component: ClassAttendanceListComponent;
  let fixture: ComponentFixture<ClassAttendanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassAttendanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
