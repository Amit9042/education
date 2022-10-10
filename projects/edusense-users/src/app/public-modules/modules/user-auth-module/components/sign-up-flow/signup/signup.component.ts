import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import {
    CommonRegexp,
    ValidationConstant,
    RouteConstant,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { SignupService } from '../../../../../services/sign-up/signup.service';
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends FormBaseComponent implements OnInit {
    // Angular variables
    @Output() clickEvent = new EventEmitter<string>();
    @Output() dataEvent = new EventEmitter<any>();

    // Form group variables
    signUpForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // State Variables
    isHidePassword = true;

    // Other Variables
    passwordError = [];

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
        this.createSignUpForm();
    };

    createSignUpForm = () => {
        this.signUpForm = this.createForm({
            first_name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            last_name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            email: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
                ]
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(50)
                ]
            ],
            has_accepted_tnc: [false]
        });
    };

    // Events
    onSubmitSignUpForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (form.value.has_accepted_tnc) {
                this._signupService.signup(form.value).subscribe(response => {
                    this._sharedService.setVerificationToken(
                        response.payload.token
                    );
                    this._sharedService.setSignupUserData(form.value.email);
                    this.clickEvent.emit('otp');
                    this._mixpanelService.track(MIXPANEL_EVENTS.SIGNUP_BASIC, {
                        email: form.value.email
                    });
                });
            } else {
                this._sharedService.setSnackBar(
                    'Please Agree The Terms & Conditions.'
                );
            }
        }
    };

    onLogin = () => {
        this.router.navigate(['/' + RouteConstant.LOGIN]);
    };

    // Helpers
    get formControls() {
        return this.signUpForm.controls;
    }
}
