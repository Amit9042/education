import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBookMarkedComponent } from './student-book-marked.component';

describe('StudentBookMarkedComponent', () => {
  let component: StudentBookMarkedComponent;
  let fixture: ComponentFixture<StudentBookMarkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBookMarkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBookMarkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
