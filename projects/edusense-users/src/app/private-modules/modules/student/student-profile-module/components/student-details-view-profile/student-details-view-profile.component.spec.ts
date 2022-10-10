import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsViewProfileComponent } from './student-details-view-profile.component';

describe('StudentDetailsViewProfileComponent', () => {
  let component: StudentDetailsViewProfileComponent;
  let fixture: ComponentFixture<StudentDetailsViewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDetailsViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailsViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
