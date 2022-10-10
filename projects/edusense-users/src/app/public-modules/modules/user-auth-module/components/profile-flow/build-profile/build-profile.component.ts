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
    RouteConstant
} from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBaseComponent, isValidImageType } from '@sharedModule/index';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { StateService } from '../../../../../services/state/state.service';
import { CityService } from '../../../../../services/city/city.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    SubjectListModel,
    GradeListModel,
    BoardListModel,
    MediumListModel,
    ProviderTypeListModel,
    CountryModdel,
    StateModel
} from '../../../../../models/provider';
import { ProfileService } from 'edusense-users/src/app/public-modules/services';

@Component({
    selector: 'app-build-profile',
    templateUrl: './build-profile.component.html',
    styleUrls: ['./build-profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BuildProfileComponent extends FormBaseComponent implements OnInit {
    @Input() dropdownData: any;

    // Form group variables
    myControl = new FormControl();
    profileForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    collegetSearchConfig: SelectSearchModel = {
        displayLabel: 'College/Tuition/School/Institute',
        controlName: 'provider',
        filterControlName: 'providerFilter',
        keyPath: 'provider_type',
        searchKey: 'provider_type',
        searchPlaceholderLabel: 'Search college/tuition/school/institute',
        selectPlaceholderLabel: 'Select college/tuition/school/institute',
        isRequired: true,
        validationMsg: this.validationMsg.COLLEGE,
        selectedValueCompairId: 'provider_type_id'
    };

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        filterControlName: 'gradeFilter',
        keyPath: 'alias',
        searchKey: 'alias',
        searchPlaceholderLabel: 'Search grade',
        selectPlaceholderLabel: 'Select grade',
        isRequired: true,
        validationMsg: this.validationMsg.GRADE,
        selectMulti: true,
        selectedValueCompairId: 'grade_id'
    };

    boardSearchConfig: SelectSearchModel = {
        displayLabel: 'Board',
        controlName: 'board',
        filterControlName: 'boardFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search board',
        selectPlaceholderLabel: 'Select board',
        isRequired: true,
        validationMsg: this.validationMsg.BOARD,
        selectMulti: true,
        selectedValueCompairId: 'board_id'
    };

    mediumSearchConfig: SelectSearchModel = {
        displayLabel: 'Medium',
        controlName: 'medium',
        filterControlName: 'mediumFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search medium',
        selectPlaceholderLabel: 'Select medium',
        isRequired: true,
        validationMsg: this.validationMsg.MEDIUM,
        selectMulti: true,
        selectedValueCompairId: 'medium_id'
    };

    subjectSearchConfig: SelectSearchModel = {
        displayLabel: 'Subject',
        controlName: 'subject',
        filterControlName: 'subjectFilter',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Search subject',
        selectPlaceholderLabel: 'Select subject',
        isRequired: true,
        validationMsg: this.validationMsg.SUBJECT,
        selectMulti: true,
        selectedValueCompairId: 'subject_id'
    };

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
        selectedValueCompairId: 'country_id'
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
        selectedValueCompairId: 'state_id'
    };

    //Data variable
    subjectList: SubjectListModel[] = [];
    providerTypeList: ProviderTypeListModel[] = [];
    gradeList: GradeListModel[] = [];
    boardList: BoardListModel[] = [];
    mediumList: MediumListModel[] = [];
    countryList: CountryModdel[] = [];
    stateList: StateModel[] = [];
    filteredCities = [];
    selectedData = null;

    // State Variables
    uploadeImage = [];
    imageUploadDetails;
    updateImage;
    isLoading = false;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private sharedService: SharedService,
        private profileService: ProfileService,
        private _stateService: StateService,
        private _cityService: CityService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
        this.initLocations();
    }

    ngDoCheck(): void {
        const param = this.profileService.getBuildProfileData();
        if (this.stateList.length && param) {
            this.stateList.forEach((item) => {
                if (item.state_id === param.state.state_id) {
                    this.selectedData.selectedState = item;
                }
            });
        }
    }

    initialize = () => {
        this.selectedData = this.profileService.getBuildProfileData();
        this.routeSubscriber();
        this.createProfileForm();
        this.patchValueToProfileForm(this.selectedData);
    };

    createProfileForm = () => {
        this.profileForm = this.createForm({
            provider: ['', [Validators.required]],
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
            grade: ['', [Validators.required]],
            board: ['', [Validators.required]],
            medium: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            description: [
                '',
                [Validators.minLength(2), Validators.maxLength(1000)]
            ],
            country: ['', [Validators.required]],
            state: ['', [Validators.required]],
            cityInput: ['', [Validators.required]],
            address: ['', [Validators.minLength(1), Validators.maxLength(500)]],
            city: ['', [Validators.required]],          
            cityId: ['']            
        });
    };

    patchValueToProfileForm = (param) => {
        if (param) {
            const countryId = param['country']['country_id'];
            this.getStateList(countryId);
            this.profileForm.patchValue({
                name: param['name'],
                description: param['description'],
                city: param['city'],
                cityInput: param['city'],
                cityId: param['cityId'],
                address: param['address']
            });
            this.providerTypeList.forEach((item) => {
                if (item.provider_type_id === param.provider.provider_type_id) {
                    this.selectedData.selectedProvider = item;
                }
            });
            this.countryList.forEach((item) => {
                if (item.country_id === param.country.country_id) {
                    this.selectedData.selectedCountry = item;
                }
            });

            const file = param['logo'][0]['files'][0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = (loadEvent: any) => {
                    this.imageUploadDetails = loadEvent.target.result;
                    this.uploadeImage.push({
                        reqKey: 'logo',
                        files: param['logo'][0]['files']
                    });
                };
                reader.readAsDataURL(file);
            }
        }
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
        if (resolvedData.boardList) {
            this.boardList = resolvedData.boardList;
        }
        if (resolvedData.mediumList) {
            this.mediumList = resolvedData.mediumList;
        }
        if (resolvedData.subjectList) {
            this.subjectList = resolvedData.subjectList;
        }
        if (resolvedData.countryList) {
            this.countryList = resolvedData.countryList;
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
                        this.formControls['cityId'].reset();
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
            this.formControls['cityId'].setValue(city['city_id']);
        }
    };

    clearStateValue = () => {
        this.formControls['state'].setValue('');
        this.stateList = [];
        this.filteredCities = [];
        this.formControls['cityId'].setValue('');
        this.formControls['city'].setValue('');
        this.formControls['cityInput'].setValue('');
    };

    clearCityValue = () => {
        this.filteredCities = [];
        this.formControls['cityId'].setValue('');
        this.formControls['city'].setValue('');
        this.formControls['cityInput'].setValue('');
    };

    displayFn(user) {
        return user || '';
    }

    onBack = () => {
        // this.sharedService.logout();
    };

    onPersonalProfile = () => {};

    // Events
    onSubmitProfileForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (this.uploadeImage.length) {
                let params = form.value;
                params['logo'] = this.uploadeImage;
                this.profileService.setBuildProfileData(params);
                this.router.navigate(['/' + RouteConstant.PERSONAL_INFO]);
            } else {
                this.sharedService.setSnackBar('Please Select The Logo.');
            }
        }
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
        }
    }

    // Helpers
    get formControls() {
        return this.profileForm.controls;
    }
}
