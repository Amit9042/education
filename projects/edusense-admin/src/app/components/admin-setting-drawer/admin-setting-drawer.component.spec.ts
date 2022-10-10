import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingDrawerComponent } from './admin-setting-drawer.component';

describe('AdminSettingDrawerComponent', () => {
  let component: AdminSettingDrawerComponent;
  let fixture: ComponentFixture<AdminSettingDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSettingDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettingDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
