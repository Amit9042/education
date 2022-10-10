import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentRequestListComponent } from './enrolment-request-list.component';

describe('EnrollmentRequestListComponent', () => {
  let component: EnrolmentRequestListComponent;
  let fixture: ComponentFixture<EnrolmentRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolmentRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
