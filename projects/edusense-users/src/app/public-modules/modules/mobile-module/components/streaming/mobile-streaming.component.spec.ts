import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileStreamingComponent } from './mobile-streaming.component';

describe('StreamingComponent', () => {
  let component: MobileStreamingComponent;
  let fixture: ComponentFixture<MobileStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
