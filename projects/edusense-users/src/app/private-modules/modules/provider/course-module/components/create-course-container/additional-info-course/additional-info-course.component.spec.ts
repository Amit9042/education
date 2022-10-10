import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoCourseComponent } from './additional-info-course.component';

describe('AdditionalInfoCourseComponent', () => {
  let component: AdditionalInfoCourseComponent;
  let fixture: ComponentFixture<AdditionalInfoCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalInfoCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
