import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileContainerComponent } from './view-profile-container.component';

describe('ViewProfileContainerComponent', () => {
  let component: ViewProfileContainerComponent;
  let fixture: ComponentFixture<ViewProfileContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProfileContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
