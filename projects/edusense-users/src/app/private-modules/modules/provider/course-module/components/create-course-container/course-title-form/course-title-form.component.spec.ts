import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTitleFormComponent } from './course-title-form.component';

describe('CourseTitleFormComponent', () => {
  let component: CourseTitleFormComponent;
  let fixture: ComponentFixture<CourseTitleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseTitleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTitleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
