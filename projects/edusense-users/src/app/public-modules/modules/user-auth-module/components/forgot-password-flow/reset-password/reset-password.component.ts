import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
    RouteConstant,
    ValidationConstant,
    CommonRegexp,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { ForgotPasswordService } from 'edusense-users/src/app/public-modules/services';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends FormBaseComponent
    implements OnInit {
    // Form Group Variable
    resetPasswordForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // Data Variable
    token: any;

    // State Variables
    hide = true;
    showLoader = false;
    newPassword = true;
    confirmPassword = true;

    constructor(
        private router: Router,
        fb: FormBuilder,
        private _sharedService: SharedService,
        private _forgotPasswordService: ForgotPasswordService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createResetPassworForm();
    };

    createResetPassworForm = () => {
        this.resetPasswordForm = this.createForm(
            {
                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(14)
                    ]
                ],
                confirmPassword: ['', [Validators.required]]
            },
            { validator: this.validate }
        );
    };

    onResetPasswordFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = {
                token: this._sharedService.getVerificationToken(),
                password: form.value.newPassword
            };
            this._forgotPasswordService
                .resetPassword(param)
                .subscribe((response) => {
                    this._sharedService.setSignupUserData(null);
                    this.onCancel();
                    this._mixpanelService.track(
                        MIXPANEL_EVENTS.FORGOT_PASSWORD_NEW_PASS,{});
                });
        }
    };

    validate(resetPasswordFormGroup: FormGroup) {
        const password = resetPasswordFormGroup.controls.newPassword;
        const repeatPassword = resetPasswordFormGroup.controls.confirmPassword;
        if (repeatPassword.value.length <= 0) {
            return null;
        }
        if (password.value.length === 0) {
            return null;
        }
        if (repeatPassword.value !== password.value) {
            repeatPassword.setErrors({ incorrect: true });
            return {
                doesMatchPassword: true
            };
        } else {
            repeatPassword.setErrors(null);
        }
        return null;
    }

    onCancel = () => {
        this.router.navigate(['/' + RouteConstant.LOGIN]);
    };

    get formControls() {
        return this.resetPasswordForm.controls;
    }

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
