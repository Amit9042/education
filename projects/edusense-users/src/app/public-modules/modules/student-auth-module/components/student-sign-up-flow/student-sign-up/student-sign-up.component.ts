import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import {
    CommonRegexp,
    ValidationConstant,
    RouteConstant
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { StudentSignupService } from '../../../../../services/student-signup/student-signup.service';
import { SharedService } from '@sharedModule/services';
import { MIXPANEL_EVENTS } from '@sharedModule/constants';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { StudentCountryModel } from '@sharedModule/models';
import { StudentAutenticationService } from 'edusense-users/src/app/public-modules/services';
import { queryParamsFunction } from '@sharedModule/functions';

@Component({
    selector: 'app-student-sign-up',
    templateUrl: './student-sign-up.component.html',
    styleUrls: ['./student-sign-up.component.scss']
})
export class StudentSignUpComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @Output() clickEvent = new EventEmitter<string>();
    @Output() dataEvent = new EventEmitter<any>();

    // Form group variables
    studentSignUpForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // State Variables
    isHidePassword = true;
    isHideConfirmPassword = true;

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

    // Other Variables
    passwordError = [];

    constructor(
        fb: FormBuilder,
        private router: Router,
        private _studentSignUpService: StudentSignupService,
        private _studentAuthenticationService: StudentAutenticationService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createStudentSignUpForm();
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

    createStudentSignUpForm = () => {
        this.studentSignUpForm = this.createForm(
            {
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
                ],
                confirmPassword: ['', [Validators.required]],
                has_accepted_tnc: [false]
            },
            { validator: this.validate }
        );
    };

    validate(studentSignUpFormGroup: FormGroup) {
        const password = studentSignUpFormGroup.controls.password;
        const repeatPassword = studentSignUpFormGroup.controls.confirmPassword;
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

    // Events
    onSubmitStudentSignUpForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (form.value.has_accepted_tnc) {
                const params = this.prepareParams(form.value);
                this._studentSignUpService
                    .signup(params)
                    .subscribe((response) => {
                        this._sharedService.setVerificationToken(
                            response.payload.token
                        );
                        this._sharedService.setSignupUserData(
                            params['contact_number']
                        );
                        this.clickEvent.emit('student-otp');
                        this._mixpanelService.track(
                            MIXPANEL_EVENTS.SIGNUP_BASIC_STUD,
                            { contact_number: form.value.contact_number }
                        );
                    });
            } else {
                this._sharedService.setSnackBar(
                    'Please Agree The Terms & Conditions.'
                );
            }
        }
    };

    prepareParams(params) {
        params['dial_code_country_id'] = params.countryCode.country_id;
        params['dial_code'] = params.countryCode.dial_code;
        delete params['confirmPassword'];
        delete params['countryCode'];
        return params;
    }

    onLogin = () => {
        this.router.navigate(['/' + RouteConstant.LOGIN]);
    };

    onCountryCodeSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.studentSignUpForm.controls;
    }
}
