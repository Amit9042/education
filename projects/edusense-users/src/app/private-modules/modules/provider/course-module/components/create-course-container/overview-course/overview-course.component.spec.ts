import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCourseComponent } from './overview-course.component';

describe('OverviewCourseComponent', () => {
  let component: OverviewCourseComponent;
  let fixture: ComponentFixture<OverviewCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
