import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileOtpDialogComponent } from './mobile-otp-dialog.component';

describe('MobileOtpDialogComponent', () => {
  let component: MobileOtpDialogComponent;
  let fixture: ComponentFixture<MobileOtpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileOtpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileOtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
