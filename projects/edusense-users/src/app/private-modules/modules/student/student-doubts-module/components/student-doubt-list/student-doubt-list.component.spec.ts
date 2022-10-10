import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDoubtListComponent } from './student-doubt-list.component';

describe('StudentDoubtListComponent', () => {
  let component: StudentDoubtListComponent;
  let fixture: ComponentFixture<StudentDoubtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDoubtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDoubtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
