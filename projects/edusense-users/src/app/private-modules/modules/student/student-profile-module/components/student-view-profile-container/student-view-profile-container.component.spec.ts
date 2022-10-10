import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewProfileContainerComponent } from './student-view-profile-container.component';

describe('StudentViewProfileContainerComponent', () => {
  let component: StudentViewProfileContainerComponent;
  let fixture: ComponentFixture<StudentViewProfileContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentViewProfileContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentViewProfileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
