import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailOtpDialogComponent } from './email-otp-dialog.component';

describe('EmailOtpDialogComponent', () => {
  let component: EmailOtpDialogComponent;
  let fixture: ComponentFixture<EmailOtpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailOtpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailOtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
