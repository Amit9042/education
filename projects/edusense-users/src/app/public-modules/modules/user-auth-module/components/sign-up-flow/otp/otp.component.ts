import {
    Component,
    OnInit,
    ViewChild,
    EventEmitter,
    Output,
    Input,
    OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import {
    ValidationConstant,
    CommonRegexp,
    RouteConstant,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { SignupService } from '../../../../../services/sign-up/signup.service';
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.scss']
})
export class OtpComponent extends FormBaseComponent
    implements OnInit, OnDestroy {
    // Angular variables
    @Output() clickEvent = new EventEmitter<string>();
    @Input() email;
    @Input() resendParams = null;
    @ViewChild('inputRef1', { static: true }) inputRef1;
    @ViewChild('inputRef2', { static: true }) inputRef2;
    @ViewChild('inputRef3', { static: true }) inputRef3;
    @ViewChild('inputRef4', { static: true }) inputRef4;
    @ViewChild('inputRef5', { static: true }) inputRef5;
    @ViewChild('inputRef6', { static: true }) inputRef6;

    showResendOTPButton = true;
    clockDisplay: string;
    interval: any;
    duration: number;
    otptimeOut: number;

    // Form Group Variable
    otpForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(
        fb: FormBuilder,
        private router: Router,
        private _signupService: SignupService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createOtpForm();
        this.setTimerValue();
    };

    createOtpForm = () => {
        this.otpForm = this.createForm({
            otpInput1: [
                '',
                [
                    <any>Validators.required,
                    <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput2: [
                '',
                [
                    <any>Validators.required,
                    <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput3: [
                '',
                [
                    <any>Validators.required,
                    <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput4: [
                '',
                [
                    <any>Validators.required,
                    <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput5: [
                '',
                [
                    <any>Validators.required,
                    <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput6: [
                '',
                [
                    <any>Validators.required,
                    <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ]
        });
        // setTimeout(() => {
        //   this.inputRef1.nativeElement.focus();
        // }, 100);
    };

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

    /**
     * Field Blur Event
     */
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

    /**
     * Field Focus Event
     */
    onFocus(currentRef) {
        const originalValue = currentRef.value;
        currentRef.value = '';
        currentRef.blur();
        currentRef.focus();
        currentRef.value = originalValue;
    }

    onOtpFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const params = { ...form.value };
            const requestParams = {};
            let otp = '';
            for (const key in params) {
                otp += params[key];
            }
            requestParams['token'] = this._sharedService.getVerificationToken();
            requestParams['otp'] = +otp;
            this._signupService.verifyOtp(requestParams).subscribe(response => {
                const accessToken = response.payload.accessToken;
                const refreshToken = response.payload.refreshToken;
                this._sharedService.setToken(accessToken);
                this._sharedService.setRefreshToken(refreshToken);
                this.router.navigate(['/' + RouteConstant.BUILD_PROFILE]);
                this._mixpanelService.track(MIXPANEL_EVENTS.SIGNUP_VERIFY_EMAIL, {});
            });
        } else {
            this._sharedService.setSnackBar('OTP is required.');
        }
    };

    onPasteEvent(event: ClipboardEvent) {
        const clipboardData = event.clipboardData; // || window.clipboardData
        const pastedText = clipboardData.getData('text');
        const arry = pastedText.split('');

        for (let i = 0; i < arry.length; i++) {
            this.otpForm.get('otpInput' + (i + 1)).setValue(arry[i]);
        }
        this.inputRef6.nativeElement.focus();
    }

    onResendOTP() {
        const params = { token: this._sharedService.getVerificationToken() };
        this._signupService.resendOtp(params).subscribe(res => {
            this._sharedService.setVerificationToken(res.payload.token);
            this.showResendOTPButton = false;
            this.setTimerValue();
        });
    }

    startTimer(duration: number) {
        if (duration > 0) {
            let timer: number = +duration;
            let minutes: any;
            let seconds: any;
            const self = this;
            self.interval = setInterval(function() {
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

    get formControls() {
        return this.otpForm.controls;
    }

    onBack = () => {
        this.clickEvent.emit('sign-up');
    };

    ngOnDestroy() {
        this._sharedService.setSignupUserData(null);
    }
}
