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
import { StudentForgotPasswordService } from 'edusense-users/src/app/public-modules/services';

@Component({
    selector: 'app-student-reset-password',
    templateUrl: './student-reset-password.component.html',
    styleUrls: ['./student-reset-password.component.scss']
})
export class StudentResetPasswordComponent extends FormBaseComponent
    implements OnInit {
    // Form Group Variable
    studentResetPasswordForm: FormGroup;

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
        private _studentForgotPasswordService: StudentForgotPasswordService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createStudentResetPassworForm();
    };

    createStudentResetPassworForm = () => {
        this.studentResetPasswordForm = this.createForm(
            {
                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(50),
                    ]
                ],
                confirmPassword: ['', [Validators.required]]
            },
            { validator: this.validate }
        );
    };

    onStudentResetPasswordFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = {};
            param['password'] = form.value.newPassword;
            param['token'] = this._sharedService.getVerificationToken();
            this._studentForgotPasswordService
                .resetStudentPassword(param)
                .subscribe((response) => {
                    this.router.navigate(['/' + RouteConstant.LOGIN]);
                    this._mixpanelService.track(
                        MIXPANEL_EVENTS.FORGOT_PASSWORD_NEW_PASS_STUD,{});
                });
        }
    };

    validate(studentResetPasswordFormGroup: FormGroup) {
        const password = studentResetPasswordFormGroup.controls.newPassword;
        const repeatPassword =
            studentResetPasswordFormGroup.controls.confirmPassword;
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
        return this.studentResetPasswordForm.controls;
    }

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
