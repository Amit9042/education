import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBuildProfileComponent } from './student-build-profile.component';

describe('StudentBuildProfileComponent', () => {
  let component: StudentBuildProfileComponent;
  let fixture: ComponentFixture<StudentBuildProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBuildProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBuildProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
