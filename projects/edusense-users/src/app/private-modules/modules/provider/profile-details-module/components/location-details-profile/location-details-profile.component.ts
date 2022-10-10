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
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBaseComponent, SharedUserService } from '@sharedModule/index';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { ProviderProfileService } from '../../services';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StateService } from 'edusense-users/src/app/public-modules/services/state/state.service';
import { CityService } from 'edusense-users/src/app/public-modules/services/city/city.service';

@Component({
    selector: 'app-location-details-profile',
    templateUrl: './location-details-profile.component.html',
    styleUrls: ['./location-details-profile.component.scss']
})
export class LocationDetailsProfileComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;
    @Input() uploadeImage;

    // Form group variables
    myControl = new FormControl();
    profileForm: FormGroup;

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
    countryList: any[] = [];
    stateList: any[] = [];

    // State Variables
    imageUploadDetails;
    updateImage;

    userDetail;
    isLoading = false;
    selectedData;
    filteredCities = [];

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private _providerProfileService: ProviderProfileService,
        private _sharedUserService: SharedUserService,
        private _stateService: StateService,
        private _cityService: CityService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
        this.getData();
    }

    ngDoCheck(): void {
        if (this.stateList.length && this.userDetail) {
            this.stateList.forEach((item) => {
                if (item.state_id === this.userDetail.state_id) {
                    this.selectedData.selectedState = item;
                }
            });
        }
    }

    initialize = () => {
        this.userDetail = this._sharedUserService.getUser();
        this.selectedData = this.userDetail.user;
        this.createProfileForm();
        this.initLocations();
    };

    createProfileForm = () => {
        this.profileForm = this.createForm({
            country: ['', [Validators.required]],
            state: ['', [Validators.required]],
            cityInput: ['', [Validators.required]],
            address: ['', [Validators.minLength(1), Validators.maxLength(500)]],
            city: ['', [Validators.required]],
            city_id: ['']
        });
    };

    patchFormValue = () => {
        this.profileForm.patchValue({
            address: this.userDetail['address'],
            city: this.userDetail['city']['city_name'],
            cityInput: this.userDetail['city']['city_name'],
            city_id: this.userDetail['city_id']
        });
        this.countryList.forEach((item) => {
            if (item.country_id === this.userDetail.country.country_id) {
                this.selectedData.selectedCountry = item;
            }
        });
    };

    getData = () => {
        const countryId = this.userDetail.country_id;

        const param = { showAll: true };
        this._providerProfileService
            .getCountryList(param)
            .subscribe((response) => {
                this.countryList = response.payload;
                this.patchFormValue();
            });
        this.getStateList(countryId);
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
        delete(this.selectedData.selectedState);
    };

    clearCityValue = () => {
        this.filteredCities = [];
        this.formControls['city_id'].setValue('');
        this.formControls['city'].setValue('');
        this.formControls['cityInput'].setValue('');
    };

    onPersonalProfile = () => {
        this.router.navigate(['/' + RouteConstant.PERSONAL_INFO]);
    };

    onViewProfile = () => {
        this.router.navigate(['/' + RouteConstant.PROFILE_DETAILS_VIEW]);
    };

    // Events
    onSubmitProfileForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = this.prepareRequestData(form.value);
            this._providerProfileService
                .updateProviderProfile(param, this.uploadeImage)
                .subscribe((response) => {
                    this.getProviderDetail();
                });
        }
    };

    getProviderDetail = () => {
        this._providerProfileService
            .getPoviderDetail(this.userDetail.provider_uuid)
            .subscribe((response) => {
                this._sharedUserService.setUser(response.payload);
                this.onViewProfile();
            });
    };

    prepareRequestData = (formValue) => {
        const param = {};
        const gradeList = [];
        const boardList = [];
        const mediumList = [];
        const subjectList = [];

        this.userDetail.provider_grades.forEach((element) => {
            gradeList.push(element.grade_id);
        });
        this.userDetail.provider_boards.forEach((element) => {
            boardList.push(element.board_id);
        });
        this.userDetail.provider_mediums.forEach((element) => {
            mediumList.push(element.medium_id);
        });
        this.userDetail.provider_subjects.forEach((element) => {
            subjectList.push(element.subject_id);
        });

        param['grades'] = gradeList;
        param['boards'] = boardList;
        param['mediums'] = mediumList;
        param['subjects'] = subjectList;

        param['country_id'] = formValue['country']['country_id'];
        param['state_id'] = formValue['state']['state_id'];
        param['city_name'] = formValue['city'];
        param['address'] = formValue['address'];

        param['provider_type_id'] = this.userDetail['provider_type_id'];
        param['name'] = this.userDetail['name'];
        param['provider_first_name'] = this.userDetail['provider_first_name'];
        param['provider_last_name'] = this.userDetail['provider_last_name'];
        param['provider_position'] = this.userDetail['provider_position'];

        return param;
    };

    //autocomplete fields
    onSelectChangeEvent(event, flag) {
        switch (flag) {
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
