import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDetailsProfileComponent } from './provider-details-profile.component';

describe('ProviderDetailsProfileComponent', () => {
  let component: ProviderDetailsProfileComponent;
  let fixture: ComponentFixture<ProviderDetailsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderDetailsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDetailsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
