import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStartedContactUsComponent } from './getting-started-contact-us.component';

describe('GettingStartedContactUsComponent', () => {
  let component: GettingStartedContactUsComponent;
  let fixture: ComponentFixture<GettingStartedContactUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStartedContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
