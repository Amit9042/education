import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationDrawerComponent } from './admin-notification-drawer.component';

describe('AdminNotificationDrawerComponent', () => {
  let component: AdminNotificationDrawerComponent;
  let fixture: ComponentFixture<AdminNotificationDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
