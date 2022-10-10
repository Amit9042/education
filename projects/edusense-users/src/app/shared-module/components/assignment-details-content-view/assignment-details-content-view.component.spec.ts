import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentDetailsContentViewComponent } from '@sharedModule/components';

describe('AssignmentDetailsContentViewComponent', () => {
  let component: AssignmentDetailsContentViewComponent;
  let fixture: ComponentFixture<AssignmentDetailsContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentDetailsContentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentDetailsContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
