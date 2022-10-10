import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderViewProfileComponent } from './provider-view-profile.component';

describe('ProviderViewProfileComponent', () => {
  let component: ProviderViewProfileComponent;
  let fixture: ComponentFixture<ProviderViewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
