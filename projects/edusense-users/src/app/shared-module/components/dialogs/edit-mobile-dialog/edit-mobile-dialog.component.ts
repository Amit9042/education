import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationConstant, CommonRegexp } from '@sharedModule/constants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBaseComponent } from '@sharedModule/components/form-base/form-base.component';
import { MobileOtpDialogComponent } from '../mobile-otp-dialog/mobile-otp-dialog.component';
import { StudentProfileService } from 'edusense-users/src/app/private-modules/modules/student/student-profile-module/services';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { StudentCountryModel } from '@sharedModule/models/student-country.model';
import { StudentAutenticationService } from 'edusense-users/src/app/public-modules/services';
import { queryParamsFunction } from '@sharedModule/functions';

@Component({
    selector: 'app-edit-mobile-dialog',
    templateUrl: './edit-mobile-dialog.component.html',
    styleUrls: ['./edit-mobile-dialog.component.scss']
})
export class EditMobileDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form group variables
    mobileNoForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

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
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<EditMobileDialogComponent>,
        private _studentProfileService: StudentProfileService,
        private _studentAuthenticationService: StudentAutenticationService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.createEditEmailForm();
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
    }

    createEditEmailForm() {
        this.mobileNoForm = this.createForm({
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
    onSubmitEditMobileNoForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = {
                contact_number: form.value.mobileNumber,
                dial_code_country_id: form.value.countryCode.country_id,
                dial_code: form.value.countryCode.dial_code
            };
            this._studentProfileService
                .updateContactNumber(param)
                .subscribe((response) => {
                    this.onCloseDialog(param);
                });
        }
    };

    onCloseDialog(result?): void {
        this.dialogRef.close(result);
    }

    onCountryCodeSelectChangeEvent(event, flag) {
        this.formControls[flag].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.mobileNoForm.controls;
    }
}
