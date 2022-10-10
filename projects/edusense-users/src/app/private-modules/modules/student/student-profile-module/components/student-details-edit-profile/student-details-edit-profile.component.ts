import { Component, OnInit, Input } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    ValidationConstant,
    CommonRegexp,
    RouteConstant
} from '@sharedModule/constants';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBaseComponent } from '@sharedModule/components';
import { EditEmailDialogComponent } from '@sharedModule/components/dialogs/edit-email-dialog/edit-email-dialog.component';
import { EditMobileDialogComponent } from '@sharedModule/components/dialogs/edit-mobile-dialog/edit-mobile-dialog.component';
import { ProfileDetailModel } from '../../models';
import { StudentProfileService } from '../../services';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { of } from 'rxjs';
import { MobileOtpDialogComponent } from '@sharedModule/components/dialogs/mobile-otp-dialog/mobile-otp-dialog.component';

@Component({
    selector: 'app-student-details-edit-profile',
    templateUrl: './student-details-edit-profile.component.html',
    styleUrls: ['./student-details-edit-profile.component.scss']
})
export class StudentDetailsEditProfileComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;
    @Input() userProfileDetail: ProfileDetailModel;
    @Input() uploadedImage;

    // Form group variables
    myControl = new FormControl();
    profileForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'alias',
        searchKey: 'alias',
        searchPlaceholderLabel: 'Select grade',
        selectPlaceholderLabel: 'Search grade',
        isRequired: true,
        validationMsg: this.validationMsg.GRADE
    };

    countrySearchConfig: SelectSearchModel = {
        displayLabel: 'Country',
        controlName: 'country',
        filterControlName: 'countryFilter',
        keyPath: 'country_name',
        searchKey: 'country_name',
        searchPlaceholderLabel: 'Select country',
        selectPlaceholderLabel: 'Search country',
        isRequired: true,
        validationMsg: this.validationMsg.COUNTRY
    };

    stateSearchConfig: SelectSearchModel = {
        displayLabel: 'State',
        controlName: 'state',
        filterControlName: 'stateFilter',
        keyPath: 'state_name',
        searchKey: 'state_name',
        searchPlaceholderLabel: 'Select state',
        selectPlaceholderLabel: 'Search state',
        isRequired: true,
        validationMsg: this.validationMsg.STATE
    };

    //Data variable
    userDetail: any;
    providerTypeList: any[] = [];
    gradeList: any[] = [];
    countryList: any[] = [];
    stateList: any[] = [];
    filteredCities = [];
    selectedData = null;
    isLoading = false;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private _studentProfileService: StudentProfileService,
        private _sharedService: SharedService,
        private _sharedUserService: SharedUserService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    ngDoCheck(): void {
        const param = this._sharedUserService.getUser();
        if (this.stateList.length && param) {
            this.stateList.forEach((item) => {
                if (item.state_id === param.state_id) {
                    this.selectedData.selectedState = item;
                }
            });
        }
    }

    initialize = () => {
        this.selectedData = this._sharedUserService.getUser();
        this.getData();
        this.createProfileForm();
        this.initLocations();
    };

    createProfileForm = () => {
        this.profileForm = this.createForm({
            gender: ['', Validators.required],
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
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
                ]
            ],
            dial_code_country_id: [''],
            dial_code: [''],
            mobileNumber: [
                '',
                [
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(14),
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            school_name: [
                '',
                [
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            grade: ['', [Validators.required]],
            country: ['', [Validators.required]],
            state: ['', [Validators.required]],
            cityInput: ['', [Validators.required]],
            city: ['', [Validators.required]],
            city_id: ['']
        });
    };

    patchProfileForm = (param) => {
        if (param) {
            const countryId = param['country_id'];
            this.getStateList(countryId);
            this.profileForm.patchValue({
                gender: param['gender'],
                first_name: param['user_details']['first_name'],
                last_name: param['user_details']['last_name'],
                school_name: param['school_name'],
                dial_code_country_id:
                    param['user_details']['dial_code_country_id'],
                dial_code: param['user_details']['dial_code'],
                mobileNumber: param['user_details']['contact_number'],
                email: param['user_details']['email'],
                city: param['student_city']['city_name'],
                cityInput: param['student_city']['city_name'],
                city_id: param['city_id']
            });

            this.gradeList.forEach((item) => {
                if (item.grade_id === param.student_grade.grade_id) {
                    this.selectedData.selectedGrade = item;
                }
            });
            this.countryList.forEach((item) => {
                if (item.country_id === param.country_id) {
                    this.selectedData.selectedCountry = item;
                }
            });
        }
    };

    getData = () => {
        const param = { showAll: true };
        this._studentProfileService
            .getGradeList(param)
            .subscribe((response) => {
                this.gradeList = response.payload;
                this.callPatchValue();
            });
        this._studentProfileService
            .getCountryList(param)
            .subscribe((response) => {
                this.countryList = response.payload;
                this.callPatchValue();
            });
    };

    callPatchValue = () => {
        if (this.gradeList.length && this.countryList.length) {
            const data = this._sharedUserService.getUser();
            this.patchProfileForm(data);
        }
    };

    initLocations = () => {
        this.profileForm
            .get('cityInput')
            .valueChanges.pipe(
                debounceTime(300),
                tap(() => (this.isLoading = true)),
                switchMap((value) => {
                    if (this.formControls['city'].value !== value) {
                        this.formControls['city_id'].reset();
                    }
                    return this.formControls['city'].value !== value
                        ? this.getCityList(value)
                        : of(this.filteredCities);
                })
            )
            .subscribe((cities) => {
                this.filteredCities = (cities && cities['payload']) || [];
            });
    };

    getStateList = (countryId) => {
        const param = {
            search: JSON.stringify({ country_id: countryId }),
            showAll: true
        };
        this._studentProfileService
            .getStateList(param)
            .subscribe((response) => {
                this.stateList = response.payload;
            });
    };

    getCityList = (value) => {
        if (this.formControls['state'].value) {
            const stateId = this.formControls['state'].value.state_id;
            const param = {
                search: JSON.stringify({
                    city_name: value,
                    state_id: stateId
                })
            };
            return this._studentProfileService.getCityList(param);
        }
    };

    changeCity = (city) => {
        if (city instanceof Object && city['city_id']) {
            this.formControls['city'].setValue(city['city_name']);
            this.formControls['city_id'].setValue(city['city_id']);
        }
    };

    clearStateValue = () => {
        this.formControls['state'].setValue('');
        this.stateList = [];
        this.filteredCities = [];
        this.formControls['city_id'].setValue('');
        this.formControls['city'].setValue('');
        this.formControls['cityInput'].setValue('');
        delete(this.selectedData.selectedState);
    };

    clearCityValue = () => {
        this.filteredCities = [];
        this.formControls['city_id'].setValue('');
        this.formControls['city'].setValue('');
        this.formControls['cityInput'].setValue('');
    };

    //Api Calls
    getStudentCountryListApiCall = (params) => {
        return this._studentProfileService.getStudentCountryCodeList(params);
    };

    // Events
    onSubmitProfileForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = this.prepareParameter(form.value);
            this._studentProfileService
                .updateProfileDetail(param, this.uploadedImage)
                .subscribe((response) => {
                    this._sharedUserService.setUser(response.payload);
                    this.router.navigate([
                        '/' + RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE
                    ]);
                });
        }
    };

    prepareParameter = (params) => {
        params['grade_id'] = params['grade']
            ? params['grade']['grade_id']
            : params['grade_id'];
        params['country_id'] = params['country']
            ? params['country']['country_id']
            : params['country_id'];
        params['state_id'] = params['state']
            ? params['state']['state_id']
            : params['state_id'];

        delete params['mobileNumber'];
        delete params['grade'];
        delete params['country'];
        delete params['state'];
        delete params['city'];
        delete params['cityInput'];
        delete params['gradeFilter'];
        delete params['providerTypeFilter'];
        delete params['stateFilter'];
        delete params['countryCode'];

        return params;
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    //autocomplete fields
    onSelectChangeEvent(event, flag) {
        switch (flag) {
            case 'provider':
                this.formControls[flag].setValue(event);
                break;
            case 'country':
                this.clearStateValue();
                this.formControls[flag].setValue(event);
                this.getStateList(event.country_id);
                break;
            case 'state':
                this.formControls[flag].setValue(event);
                this.clearCityValue();
                break;
        }
    }

    onEditMobileNo = () => {
        const dialogRef = this.dialog.open(EditMobileDialogComponent, {
            panelClass: 'dialog-container',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                const newdialogRef = this.dialog.open(
                    MobileOtpDialogComponent,
                    {
                        panelClass: 'dialog-container',
                        data: {
                            mobileNumber: data.contact_number,
                            dial_code: data.dial_code,
                            dial_code_country_id: data.dial_code_country_id
                        }
                    }
                );
                newdialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.formControls['mobileNumber'].setValue(
                            result.mobileNumber
                        );
                        this.formControls['dial_code_country_id'].setValue(
                            result.dial_code_country_id
                        );
                        this.formControls['dial_code'].setValue(
                            result.dial_code
                        );
                    } else {
                        this.onEditMobileNo();
                    }
                });
            }
        });
    };

    // Helpers
    get formControls() {
        return this.profileForm.controls;
    }
}
