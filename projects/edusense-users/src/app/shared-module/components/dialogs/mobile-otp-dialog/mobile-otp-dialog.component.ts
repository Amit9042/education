import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBaseComponent } from '@sharedModule/components/form-base/form-base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationConstant, CommonRegexp } from '@sharedModule/constants';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@sharedModule/services';
import { StudentProfileService } from 'edusense-users/src/app/private-modules/modules/student/student-profile-module/services';

@Component({
    selector: 'app-mobile-otp-dialog',
    templateUrl: './mobile-otp-dialog.component.html',
    styleUrls: ['./mobile-otp-dialog.component.scss']
})
export class MobileOtpDialogComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @ViewChild('inputRef1', { static: true }) inputRef1;
    @ViewChild('inputRef2', { static: true }) inputRef2;
    @ViewChild('inputRef3', { static: true }) inputRef3;
    @ViewChild('inputRef4', { static: true }) inputRef4;
    @ViewChild('inputRef5', { static: true }) inputRef5;
    @ViewChild('inputRef6', { static: true }) inputRef6;

    // Form group variables
    mobileOtpForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    showResendOTPButton = true;
    clockDisplay: string;
    interval: any;
    duration: number;
    otptimeOut: number;

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<MobileOtpDialogComponent>,
        private _studentProfileService: StudentProfileService,
        private _sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.createEmailOtpForm();
        this.setTimerValue();
    }

    createEmailOtpForm() {
        this.mobileOtpForm = this.createForm({
            otpInput1: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput2: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput3: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput4: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput5: [
                '',
                [
                    Validators.required as any,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP) as any
                ]
            ],
            otpInput6: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ]
        });
    }

    setTimerValue = () => {
        this.otptimeOut = 3; // set 3 minute timeout
        if (this.otptimeOut > 0) {
            this.duration = 60 * +this.otptimeOut;
            this.showResendOTPButton = false;
            this.startTimer(this.duration);
        } else {
            this.showResendOTPButton = true;
        }
    };

    onPasteEvent(event) {
        const clipboardData = event.clipboardData; // || window.clipboardData
        const pastedText = clipboardData.getData('text');
        const arry = pastedText.split('');
        for (let i = 0; i < arry.length; i++) {
            this.mobileOtpForm.get('otpInput' + (i + 1)).setValue(arry[i]);
        }
        this.inputRef6.nativeElement.focus();
    }

    onFocus(currentRef) {
        const originalValue = currentRef.value;
        currentRef.value = '';
        currentRef.blur();
        currentRef.focus();
        currentRef.value = originalValue;
    }

    onBlurInput(event, currentRef, nextRef) {
        if (event.keyCode === 16) {
            event.preventDefault();
        } else if (
            event.keyCode === 37 ||
            event.keyCode === 38 ||
            event.keyCode === 39 ||
            event.keyCode === 40
        ) {
            this.onFocus(currentRef);
        } else {
            if (nextRef) {
                setTimeout(() => {
                    nextRef.focus();
                }, 1);
            }
        }
    }

    startTimer(duration: number) {
        if (duration > 0) {
            let timer: number = +duration;
            let minutes: any;
            let seconds: any;
            const self = this;
            self.interval = setInterval(function () {
                if (timer < 0) {
                    clearInterval(self.interval);
                    self.showResendOTPButton = true;
                    self.clockDisplay = '';
                }
                minutes = Math.floor(timer / 60);
                seconds = Math.floor(timer % 60);
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;

                self.clockDisplay = minutes + ':' + seconds;
                if (--timer < 0) {
                    self.showResendOTPButton = true;
                    self.clockDisplay = '';
                    clearInterval(self.interval);
                }
            }, 1000);
        }
    }

    resendOtp() {
        this._studentProfileService
            .resendOtp(this.prepareParam())
            .subscribe((response) => {
                this.setTimerValue();
            });
    }

    // Events
    onSubmitMobileOtpForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const params = { ...form.value };
            const requestParams = this.prepareParam();
            let otp = '';
            for (const key in params) {
                otp += params[key];
            }
            requestParams['otp'] = otp;
            this._studentProfileService
                .verifyContactNumber(requestParams)
                .subscribe((response) => {
                    this.onCloseDialog(this.data);
                });
        } else {
            this._sharedService.setSnackBar('OTP is required.');
        }
    };

    prepareParam = () => {
        const param = {
            dial_code_country_id: this.data.dial_code_country_id,
            dial_code: this.data.dial_code,
            contact_number: this.data.mobileNumber
        };
        return param;
    };

    onCloseDialog(mobileNumber?): void {
        this.dialogRef.close(mobileNumber);
    }

    // Helpers
    get formControls() {
        return this.mobileOtpForm.controls;
    }
}
