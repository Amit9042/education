import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBaseComponent, SelectSearchModel } from 'utility-lib';
import {
    CommonRegexp,
    ValidationConstant
} from '../../../../../_shared/constants/admin-app-validation.constant';

@Component({
    selector: 'es-admin-edit-provider-dialog',
    templateUrl: './edit-provider-dialog.component.html',
    styleUrls: ['./edit-provider-dialog.component.scss']
})
export class EditProviderDialogComponent
    extends FormBaseComponent
    implements OnInit {
    // Form Group variables
    editProviderForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    countrySearchConfig: SelectSearchModel = {
        displayLabel: 'Country',
        controlName: 'country',
        filterControlName: 'countryFilter',
        keyPath: 'country_name',
        searchKey: 'country_name',
        searchPlaceholderLabel: 'Search country',
        selectPlaceholderLabel: 'Select country',
        isRequired: true,
        validationMsg: this.validationMsg.COUNTRY,
        selectedValueCompairId: 'country_id',
        selectMulti: false
    };

    stateSearchConfig: SelectSearchModel = {
        displayLabel: 'State',
        controlName: 'state',
        filterControlName: 'stateFilter',
        keyPath: 'state_name',
        searchKey: 'state_name',
        searchPlaceholderLabel: 'Search state',
        selectPlaceholderLabel: 'Select state',
        isRequired: true,
        validationMsg: this.validationMsg.STATE,
        selectedValueCompairId: 'state_id',
        selectMulti: false
    };

    //Data variable
    countryList: any[] = [
        {
            country_name: 'india',
            country_id: 1
        }
    ];
    stateList: any[] = [
        {
            state_name: 'Gujarat',
            state_id: 1
        }
    ];

    constructor(
        _fb: FormBuilder,
        public dialogRef: MatDialogRef<EditProviderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(_fb);
    }

    ngOnInit() {
        this.intialize();
    }

    intialize = () => {
        this.createEditProviderForm();
    };

    createEditProviderForm = () => {
        this.editProviderForm = this.createForm({
            name: [
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
            p_name: [
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
            type: ['', [Validators.required]],
            board: ['', [Validators.required]],
            country: [''],
            state: [''],
            cityInput: ['', [Validators.required]]
        });
    };

    onSubmitEditProviderForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
        }
    };

    onDialogClose() {
        this.dialogRef.close();
    }

    //autocomplete fields
    onSelectChangeEvent(event, flag) {
        switch (flag) {
            case 'country':
                this.formControls[flag].setValue(event);
                break;
            case 'state':
                this.formControls[flag].setValue(event);
                break;
        }
    }

    get formControls() {
        return this.editProviderForm.controls;
    }
}
