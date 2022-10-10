import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import {
    ValidationConstant,
    CommonRegexp,
    FileSizeEnum,
    RouteConstant,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
    FormBaseComponent,
    isValidImageType,
    queryParamsFunction
} from '@sharedModule/index';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { StateService } from '../../../../../services/state/state.service';
import { CityService } from '../../../../../services/city/city.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StudentAutenticationService } from '../../../../../services/student-autentication/student-autentication.service';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { ProfileService } from 'edusense-users/src/app/public-modules/services';
import { StudentCountryModel } from '@sharedModule/models/student-country.model';

@Component({
    selector: 'app-student-build-profile',
    templateUrl: './student-build-profile.component.html',
    styleUrls: ['./student-build-profile.component.scss']
})
export class StudentBuildProfileComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;

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
    userDetail: any;
    providerTypeList: any[] = [];
    gradeList: any[] = [];
    countryList: any[] = [];
    stateList: any[] = [];
    countryCodeList: StudentCountryModel[] = [];
    selectedCountry: StudentCountryModel = null;

    filteredCities = [];

    // State Variables
    uploadeImage = [];
    imageUploadDetails;
    updateImage;
    isLoading = false;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private sharedService: SharedService,
        private profileService: ProfileService,
        private _activeRoute: ActivatedRoute,
        private _stateService: StateService,
        private _cityService: CityService,
        private _studentAuthenticationService: StudentAutenticationService,
        private _sharedUserService: SharedUserService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.routeSubscriber();
        this.createProfileForm();
        this.setMobileNumber();
        this.initLocations();
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
            countryCode: ['', [Validators.required]],
            mobileNumber: [
                '',
                [
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(14),
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            grade: ['', [Validators.required]],
            email: [
                '',
                [
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
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
            country: ['', [Validators.required]],
            state: ['', [Validators.required]],
            cityInput: ['', [Validators.required]],
            city: ['', [Validators.required]],
            city_id: ['']
        });
    };

    /**
     * Router Subscriber
     */
    routeSubscriber = () => {
        this._activeRoute.params.subscribe((params) => {
            this._activeRoute.data.subscribe(({ resolvedData }) => {
                this.handleResolverData(resolvedData);
            });
        });
    };

    handleResolverData = (resolvedData) => {
        if (resolvedData.providerTypeList) {
            this.providerTypeList = resolvedData.providerTypeList;
        }
        if (resolvedData.gradeList) {
            this.gradeList = resolvedData.gradeList;
        }
        if (resolvedData.countryList) {
            this.countryList = resolvedData.countryList;
        }
    };

    setMobileNumber = () => {
        const config = this._sharedUserService.getUserConfig();
        this.formControls['mobileNumber'].setValue(config.contact_number);
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

    //Api Calls
    getStudentCountryListApiCall = (params) => {
        return this._studentAuthenticationService.getStudentCountryList(params);
    };

    getStateList = (countryId) => {
        const param = {
            search: JSON.stringify({ country_id: countryId }),
            showAll: true
        };
        this._stateService.getStateList(param).subscribe((response) => {
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
            return this._cityService.getCityList(param);
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
    };

    clearCityValue = () => {
        this.filteredCities = [];
        this.formControls['city_id'].setValue('');
        this.formControls['city'].setValue('');
        this.formControls['cityInput'].setValue('');
    };

    getStudentCountryList = (params) => {
        this.getStudentCountryListApiCall(params).subscribe((response) => {
            this.countryCodeList = response.payload;
            const config = this._sharedUserService.getUserConfig();
            this.countryCodeList.forEach((element) => {
                if (element.country_id === config.dial_code_country_id) {
                    this.selectedCountry = element;
                }
            });
        });
    };

    // Events
    onSubmitProfileForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (this.uploadeImage.length) {
                const param = this.prepareParameter(form.value);
                this.profileService
                    .addStudentProfileDetail(param, this.uploadeImage)
                    .subscribe((response) => {
                        this._studentAuthenticationService
                            .getStudentConfig()
                            .subscribe((res) => {
                                this.sharedService.setUserConfig(res.payload);
                                this.sharedService.setLoggedInUserStatus(true);
                                this.router.navigate([
                                    '/' +
                                        RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE
                                ]);
                                this.getUserData(res.payload);
                                this._mixpanelService.track(
                                    MIXPANEL_EVENTS.SIGNUP_BUILD_PROFILE_STUD,
                                    res.payload
                                );
                            });
                    });
            } else {
                this.sharedService.setSnackBar(
                    'Please Select Profile Picture.'
                );
            }
        }
    };

    getUserData = (data) => {
        this._studentAuthenticationService
            .getUserDetails(data.user_uuid)
            .subscribe((response) => {
                this._sharedUserService.setUser(response.payload);
            });
    };

    prepareParameter = (params) => {
        params['grade_id'] = params['grade']['grade_id'];
        params['country_id'] = params['country']['country_id'];
        params['state_id'] = params['state']['state_id'];
        params['dial_code_country_id'] = params.countryCode.country_id;
        params['dial_code'] = params.countryCode.dial_code;

        delete params['grade'];
        delete params['provider_type'];
        delete params['country'];
        delete params['state'];
        delete params['city'];
        delete params['cityInput'];
        delete params['gradeFilter'];
        delete params['providerTypeFilter'];
        delete params['countryFilter'];
        delete params['stateFilter'];
        delete params['countryCode'];

        return params;
    };

    //file upload
    onFileUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isValidImageType(event.target.files[0].type)) {
                if (
                    event.target.files[0].size > FileSizeEnum.FIVE_MB_IMAGE_SIZE
                ) {
                    this.sharedService.setSnackBar(
                        'File size is greater then 5 MB.'
                    );
                    event.target.value = null;
                } else {
                    this.uploadeImage = [];
                    const reader = new FileReader();
                    reader.onloadend = (loadEvent: any) => {
                        this.imageUploadDetails = loadEvent.target.result;
                        this.uploadeImage.push({
                            reqKey: 'logo',
                            files: event.target.files
                        });
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                this.sharedService.setSnackBar('Please select the valid file.');
                event.target.value = null;
            }
        }
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
            case 'countryCode':
                this.formControls[flag].setValue(event);
                break;
        }
    }

    // Helpers
    get formControls() {
        return this.profileForm.controls;
    }
}
