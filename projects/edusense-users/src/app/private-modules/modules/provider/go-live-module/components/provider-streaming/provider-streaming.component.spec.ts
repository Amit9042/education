import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderStreamingComponent } from './provider-streaming.component';

describe('StreamingComponent', () => {
  let component: ProviderStreamingComponent;
  let fixture: ComponentFixture<ProviderStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
