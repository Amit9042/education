import {
    Component,
    OnInit,
    ViewChild,
    EventEmitter,
    Output,
    Input
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { FormBaseComponent } from '@sharedModule/components';
import {
    ValidationConstant,
    CommonRegexp,
    RouteConstant,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { StudentSignupService } from '../../../../../services/student-signup/student-signup.service';
import { StudentAutenticationService } from '../../../../../services/student-autentication/student-autentication.service';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-student-otp',
    templateUrl: './student-otp.component.html',
    styleUrls: ['./student-otp.component.scss']
})
export class StudentOtpComponent extends FormBaseComponent implements OnInit {
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

    // Form Group Variable
    studentOtpForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    showResendOTPButton = true;
    clockDisplay: string;
    interval: any;
    duration: number;
    otptimeOut: number;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private location: Location,
        private _sharedService: SharedService,
        private _studentSignupService: StudentSignupService,
        private _studentAuthenticationService: StudentAutenticationService,
        private _sharedUserService: SharedUserService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createStudentOtpForm();
        this.setTimerValue();
    };

    createStudentOtpForm = () => {
        this.studentOtpForm = this.createForm({
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
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
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

    onStudentOtpFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const params = { ...form.value };
            const requestParams = {};
            let otp = '';
            for (const key in params) {
                otp += params[key];
            }
            requestParams['otp'] = +otp;
            requestParams['token'] = this._sharedService.getVerificationToken();
            this._studentSignupService
                .verifyOtp(requestParams)
                .subscribe((response) => {
                    const accessToken = response.payload.accessToken;
                    const refreshToken = response.payload.refreshToken;
                    this._sharedService.setToken(accessToken);
                    this._sharedService.setRefreshToken(refreshToken);
                    this._studentAuthenticationService
                    .getStudentConfig().subscribe(res => {
                        this._sharedUserService.setUserConfig(res.payload);
                        this.router.navigate([
                            '/' + RouteConstant.STUDENT_BUILD_PROFILE
                        ]);
                        this._mixpanelService.init(response['payload']);
                        this._mixpanelService.track(
                            MIXPANEL_EVENTS.SIGNUP_VERIFY_MOB_STUD,res.payload);
                    });
                });
        } else {
            this._sharedService.setSnackBar('OTP is required.')
          }
    };

    resendOtp() {
        let requestParams = {};
        requestParams['token'] = this._sharedService.getVerificationToken();
        this._studentSignupService.resendOtp(requestParams).subscribe((response) => {
            this._sharedService.setVerificationToken(response.payload.token);
            this.setTimerValue();
        });
    }

    onPasteEvent(event: ClipboardEvent) {
        const clipboardData = event.clipboardData; // || window.clipboardData
        const pastedText = clipboardData.getData('text');
        const arry = pastedText.split('');

        for (let i = 0; i < arry.length; i++) {
            this.studentOtpForm.get('otpInput' + (i + 1)).setValue(arry[i]);
        }
        this.inputRef6.nativeElement.focus();
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

    get formControls() {
        return this.studentOtpForm.controls;
    }

    onBack = () => {
        this.clickEvent.emit('student-signup');
    };
}
