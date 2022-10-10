import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCourseComponent } from './content-course.component';

describe('ContentCourseComponent', () => {
  let component: ContentCourseComponent;
  let fixture: ComponentFixture<ContentCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
