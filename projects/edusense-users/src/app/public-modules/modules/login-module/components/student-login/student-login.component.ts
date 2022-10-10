import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
    CommonRegexp,
    MIXPANEL_EVENTS,
    RouteConstant,
    ValidationConstant
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { StudentAutenticationService } from '../../../../services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { EnterpriseDetail } from '../../../../models';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { queryParamsFunction } from '@sharedModule/functions';
import { StudentCountryModel } from '@sharedModule/models';

@Component({
    selector: 'app-student-login',
    templateUrl: './student-login.component.html',
    styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent extends FormBaseComponent implements OnInit {
    // Constants variables
    validationMsg = new ValidationConstant();

    // Form Group Variable
    loginForm: FormGroup;

    // State Variables
    isHidePassword = true;

    countryCodeSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'countryCode',
        keyPath: 'dial_code',
        searchKey: 'dial_code',
        searchPlaceholderLabel: 'Search code',
        selectPlaceholderLabel: 'Select',
        isRequired: false,
        validationMsg: this.validationMsg.COUNTRY_CODE
    };

    //Data variable
    countryCodeList: StudentCountryModel[] = [];
    selectedCountry: StudentCountryModel = null;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private sharedService: SharedService,
        private _studentAuthenticationService: StudentAutenticationService,
        private _sharedUserService: SharedUserService,
        private _mixpanelService: MixpanelService,
        private _sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createLoginForm();
        this.getStudentCountryList(
            queryParamsFunction(
                {},
                {
                    active: 'name',
                    direction: 'ASC'
                },
                null,
                null,
                true
            )
        );
    };

    createLoginForm = () => {
        this.loginForm = this.createForm({
            countryCode: ['', [Validators.required]],
            contact_number: [
                '',
                [
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(14),
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
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

    //Api Calls
    getStudentCountryListApiCall = (params) => {
        return this._studentAuthenticationService.getStudentCountryList(params);
    };

    getStudentContryFromIPApiCall = () => {
        return this._studentAuthenticationService.getStudentContryFromIP();
    };

    getStudentCountryList = (params) => {
        this.getStudentCountryListApiCall(params).subscribe((response) => {
            this.countryCodeList = response.payload;
            this.getStudentContryFromIP();
        });
    };

    getStudentContryFromIP = () => {
        this.getStudentContryFromIPApiCall().subscribe((response) => {
            const country = response.payload;
            this.countryCodeList.forEach((element) => {
                if (element.country_id === country.country_id) {
                    this.selectedCountry = element;
                }
            });
        });
    };

    // Events
    onLoginFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            let params = form.value;
            params['dial_code_country_id'] = form.value.countryCode.country_id;
            params['dial_code'] = form.value.countryCode.dial_code;
            delete params.countryCode;
            this._studentAuthenticationService
                .login(params)
                .subscribe((response) => {
                    const accessToken = response.payload.accessToken;
                    const refreshToken = response.payload.refreshToken;
                    this.sharedService.setToken(accessToken);
                    this.sharedService.setRefreshToken(refreshToken);
                    this.getConfiguration();
                });
        }
    };

    getConfiguration = () => {
        this._studentAuthenticationService
            .getStudentConfig()
            .subscribe((response) => {
                if (
                    response.payload &&
                    response.payload.is_profile_completed === 0
                ) {
                    this._sharedUserService.setUserConfig(response.payload);
                    if (response.payload.enterprise.length > 0) {
                        let instituteList: EnterpriseDetail[] = response.payload.enterprise.sort(
                            (a, b) =>
                                new Date(a.jointime).getTime() -
                                new Date(a.jointime).getTime()
                        );
                        this._sharedService.setActiveEnterprise(
                            instituteList[0]
                        );
                    }
                    this.router.navigate([
                        '/' + RouteConstant.STUDENT_BUILD_PROFILE
                    ]);
                } else {
                    this._sharedUserService.setUserConfig(response.payload);
                    if (response.payload.enterprise.length > 0) {
                        let instituteList: EnterpriseDetail[] = response.payload.enterprise.sort(
                            (a, b) =>
                                new Date(a.jointime).getTime() -
                                new Date(a.jointime).getTime()
                        );
                        this._sharedService.setActiveEnterprise(
                            instituteList[0]
                        );
                    }
                    this.sharedService.setLoggedInUserStatus(true);
                    this.getUserData(response.payload);
                    this.router.navigate([
                        '/' + RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE
                    ]);
                }
                this._mixpanelService.init(response['payload']);
                this._mixpanelService.track(
                    MIXPANEL_EVENTS.SIGNIN_STUD,
                    response['payload']
                );
            });
    };

    getUserData = (data) => {
        this._studentAuthenticationService
            .getUserDetails(data.user_uuid)
            .subscribe((response) => {
                this._sharedUserService.setUser(response.payload);
            });
    };

    onSignUp = () => {
        this.router.navigate(['/' + RouteConstant.SIGN_UP]);
    };

    onForgotPassword = () => {
        this.router.navigate(['/' + RouteConstant.STUDENT_FORGOT_PASSWORD]);
    };

    onCountryCodeSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.loginForm.controls;
    }
}
