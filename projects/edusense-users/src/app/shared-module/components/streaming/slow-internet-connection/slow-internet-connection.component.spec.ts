import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowInternetConnectionComponent } from './slow-internet-connection.component';

describe('SlowInternetConnectionComponent', () => {
  let component: SlowInternetConnectionComponent;
  let fixture: ComponentFixture<SlowInternetConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlowInternetConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowInternetConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
