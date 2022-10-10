import { Component, OnInit } from '@angular/core';
import { AdminRouteConstant, CommonRegexp } from 'edusense-admin/src/app/_shared/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBaseComponent, SharedService } from 'utility-lib';
import { AdminLoginService } from '../../../services';
import { ValidationConstant } from '../../../../../../_shared/constants';

@Component({
    selector: 'es-admin-admin-login-form',
    templateUrl: './admin-login-form.component.html',
    styleUrls: ['./admin-login-form.component.scss']
})
export class AdminLoginFormComponent extends FormBaseComponent
    implements OnInit {
    // Constants variables
    validationMsg = new ValidationConstant();

    // Form Group Variable
    loginForm: FormGroup;

    // State Variables
    isHidePassword = true;

    constructor(fb: FormBuilder, private route: Router,
        private adminLoginService: AdminLoginService,
        private sharedService: SharedService
        ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createLoginForm();
    };

    createLoginForm = () => {
        this.loginForm = this.createForm({
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
                    Validators.pattern(CommonRegexp.PASSWORD_REGEXP),
                    Validators.minLength(6),
                    Validators.maxLength(50)
                ]
            ]
        });
    };

    // Events
    onLoginFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            this.adminLoginService.login(form.value).subscribe(response => {
                const accessToken = response.payload.accessToken;
                const refreshToken = response.payload.refreshToken;
                this.sharedService.setToken(accessToken);
                this.sharedService.setRefreshToken(refreshToken);
                this.sharedService.setLoggedInUserStatus(true);
                this.route.navigate(['/' + AdminRouteConstant.PROVIDER_LIST]);
            })
        }
    };

    onForgotPassword = () => {
        this.route.navigate(['/' + AdminRouteConstant.FORGOT_EMAIL_ROUTE]);
    };

    // Helpers
    get formControls() {
        return this.loginForm.controls;
    }
}
