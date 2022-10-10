import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailsProfileComponent } from './location-details-profile.component';

describe('LocationDetailsProfileComponent', () => {
  let component: LocationDetailsProfileComponent;
  let fixture: ComponentFixture<LocationDetailsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationDetailsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDetailsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
