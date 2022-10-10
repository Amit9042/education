import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditProfileContainerComponent } from './student-edit-profile-container.component';

describe('StudentEditProfileContainerComponent', () => {
  let component: StudentEditProfileContainerComponent;
  let fixture: ComponentFixture<StudentEditProfileContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEditProfileContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEditProfileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
