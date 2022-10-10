import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
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
import {
    StudentForgotPasswordService,
    StudentAutenticationService
} from 'edusense-users/src/app/public-modules/services';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { StudentCountryModel } from '@sharedModule/models';
import { queryParamsFunction } from '@sharedModule/functions';

@Component({
    selector: 'app-student-forgot-password',
    templateUrl: './student-forgot-password.component.html',
    styleUrls: ['./student-forgot-password.component.scss']
})
export class StudentForgotPasswordComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @Output() clickEvent = new EventEmitter<string>();

    // Form Group Variable
    studentForgotForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // State Variables
    showLoader = false;
    isShow = true;

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
        private router: Router,
        fb: FormBuilder,
        private _sharedService: SharedService,
        private _studentForgotPasswordService: StudentForgotPasswordService,
        private _studentAuthenticationService: StudentAutenticationService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createStudentForgotForm();
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

    // Create form
    createStudentForgotForm = () => {
        this.studentForgotForm = this.createForm({
            countryCode: ['', [Validators.required]],
            mobileNumber: [
                '',
                [
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(14),
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
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
            // this.getStudentContryFromIP();
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

    onStudentForgotFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = {
                contact_number: form.value.mobileNumber,
                dial_code_country_id: form.value.countryCode.country_id,
                dial_code: form.value.countryCode.dial_code
            };
            this._studentForgotPasswordService
                .forgotStudentPassword(param)
                .subscribe((response) => {
                    this._sharedService.setVerificationToken(
                        response.payload.token
                    );
                    this._sharedService.setSignupUserData(param);
                    this.clickEvent.emit('student-otp');
                    this._mixpanelService.track(
                        MIXPANEL_EVENTS.FORGOT_PASSWORD_STUD,
                        { contact_number: form.value.mobileNumber }
                    );
                });
        }
    };

    onBack() {
        this.router.navigate(['/' + RouteConstant.LOGIN]);
    }

    onCountryCodeSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    get formControls() {
        return this.studentForgotForm.controls;
    }
}
