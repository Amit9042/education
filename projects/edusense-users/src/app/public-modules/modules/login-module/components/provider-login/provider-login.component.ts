import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
    RouteConstant,
    CommonRegexp,
    ValidationConstant,
    RoleMaster,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { AuthenticationService } from '../../../../services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-provider-login',
    templateUrl: './provider-login.component.html',
    styleUrls: ['./provider-login.component.scss']
})
export class ProviderLoginComponent extends FormBaseComponent
    implements OnInit {
    // Constants variables
    validationMsg = new ValidationConstant();

    // Form Group Variable
    loginForm: FormGroup;

    // State Variables
    isHidePassword = true;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private sharedService: SharedService,
        private _authenticationService: AuthenticationService,
        private _sharedUserService: SharedUserService,
        private _mixpanelService:MixpanelService
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
                    Validators.minLength(6),
                    Validators.maxLength(50)
                ]
            ]
        });
    };

    // Events
    onLoginFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            this._authenticationService
                .login(form.value)
                .subscribe(response => {
                    const accessToken = response.payload.accessToken;
                    const refreshToken = response.payload.refreshToken;
                    this.sharedService.setToken(accessToken);
                    this.sharedService.setRefreshToken(refreshToken);
                    this.getConfiguration();
                });
        }
    };

    getConfiguration = () => {
        this._authenticationService.getProviderConfig().subscribe(response => {
            if (
                response.payload &&
                response.payload.is_profile_completed === 0 &&
                response.payload['user_role_link.role_id'] ===
                    RoleMaster.PROVIDER_OWNER
            ) {
                this.router.navigate(['/' + RouteConstant.BUILD_PROFILE]);
            } else {
                this._sharedUserService.setUserConfig(response.payload);
                this.sharedService.setLoggedInUserStatus(true);
                this.getUserData(response.payload);
                this.router.navigate([
                    '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
                ]);
            }
            this._mixpanelService.init(response['payload']);
            this._mixpanelService.track(
                MIXPANEL_EVENTS.SIGNIN,
                response['payload']
            );
        });
    };

    getUserData = user => {
        const id = user.provider_list[0]['provider_uuid'];
        this._authenticationService.getUserDetails(id).subscribe(respones => {
            this._sharedUserService.setUser(respones.payload);
        });
    };

    onSignUp = () => {
        this.router.navigate(['/' + RouteConstant.SIGN_UP]);
    };

    onForgotPassword = () => {
        this.router.navigate(['/' + RouteConstant.FORGOT_PASSWORD]);
    };

    // Helpers
    get formControls() {
        return this.loginForm.controls;
    }
}
