import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsEditProfileComponent } from './student-details-edit-profile.component';

describe('StudentDetailsEditProfileComponent', () => {
  let component: StudentDetailsEditProfileComponent;
  let fixture: ComponentFixture<StudentDetailsEditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDetailsEditProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailsEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
