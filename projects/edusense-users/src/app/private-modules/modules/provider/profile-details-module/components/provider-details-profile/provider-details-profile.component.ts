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
import {
    SubjectListModel,
    ProviderTypeListModel,
    GradeListModel,
    BoardListModel,
    MediumListModel
} from '../../models';

@Component({
    selector: 'app-provider-details-profile',
    templateUrl: './provider-details-profile.component.html',
    styleUrls: ['./provider-details-profile.component.scss']
})
export class ProviderDetailsProfileComponent extends FormBaseComponent
    implements OnInit {
    @Input() dropdownData: any;
    @Input() uploadeImage;

    selectedData = null;

    // Form group variables
    myControl = new FormControl();
    profileForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    subjectList: SubjectListModel[] = [];
    providerTypeList: ProviderTypeListModel[] = [];
    gradeList: GradeListModel[] = [];
    boardList: BoardListModel[] = [];
    mediumList: MediumListModel[] = [];

    collegetSearchConfig: SelectSearchModel = {
        displayLabel: 'College/Tuition/Institute',
        controlName: 'provider',
        filterControlName: 'providerFilter',
        keyPath: 'provider_type',
        searchKey: 'provider_type',
        searchPlaceholderLabel: 'Search college/tuition/institute',
        selectPlaceholderLabel: 'Select college/tuition/institute',
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

    //Data variable
    userDetail: any;

    // State Variables
    imageUploadDetails;
    updateImage;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        private _sharedUserService: SharedUserService,
        private _providerProfileService: ProviderProfileService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
        this.getData();
    }

    getData = () => {
        const param = { showAll: true };
        this._providerProfileService
            .getGradeList(param)
            .subscribe((response) => {
                this.gradeList = response.payload;
                this.callPatchValue();
            });
        this._providerProfileService
            .getMediumList(param)
            .subscribe((response) => {
                this.mediumList = response.payload;
                this.callPatchValue();
            });
        this._providerProfileService
            .getSubjectList(param)
            .subscribe((response) => {
                this.subjectList = response.payload;
                this.callPatchValue();
            });
        this._providerProfileService
            .getProviderTypeList(param)
            .subscribe((response) => {
                this.providerTypeList = response.payload;
                this.callPatchValue();
            });
        this._providerProfileService
            .getBoardList(param)
            .subscribe((response) => {
                this.boardList = response.payload;
                this.callPatchValue();
            });
    };

    initialize = () => {
        this.userDetail = this._sharedUserService.getUser();
        this.selectedData = this.userDetail.user;
        this.createProfileForm();
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
            ]
        });
    };

    callPatchValue = () => {
        if (
            this.gradeList.length &&
            this.subjectList.length &&
            this.mediumList.length &&
            this.providerTypeList.length &&
            this.boardList.length
        ) {
            const data = this._sharedUserService.getUser();
            this.patchProfileForm(data);
        }
    };

    patchProfileForm = (param) => {
        if (param) {
            this.profileForm.patchValue({
                name: param['name'],
                description: param['description']
            });
            this.providerTypeList.forEach((item) => {
                if (
                    item.provider_type_id ===
                    param.provider_type.provider_type_id
                ) {
                    this.selectedData.selectedProvider = item;
                }
            });
        }
    };

    onBack = () => {
        // this.sharedService.logout();
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
    }

    prepareRequestData = (profileData) => {
        const gradeList = [];
        const boardList = [];
        const mediumList = [];
        const subjectList = [];
        profileData.grade.forEach((element) => {
            gradeList.push(element.grade_id);
        });
        profileData.board.forEach((element) => {
            boardList.push(element.board_id);
        });
        profileData.medium.forEach((element) => {
            mediumList.push(element.medium_id);
        });
        profileData.subject.forEach((element) => {
            subjectList.push(element.subject_id);
        });
        profileData['grades'] = gradeList;
        profileData['boards'] = boardList;
        profileData['mediums'] = mediumList;
        profileData['subjects'] = subjectList;
        profileData['provider_type_id'] = profileData.provider.provider_type_id;
        profileData['country_id'] = this.userDetail['country_id'];
        profileData['state_id'] = this.userDetail['state_id'];
        profileData['city_id'] = this.userDetail['city_id'];
        profileData['provider_first_name'] = this.userDetail[
            'provider_first_name'
        ];
        profileData['provider_last_name'] = this.userDetail[
            'provider_last_name'
        ];
        profileData['provider_position'] = this.userDetail['provider_position'];
        profileData['city_name'] = this.userDetail.city['city_name'];

        delete profileData['grade'];
        delete profileData['board'];
        delete profileData['subject'];
        delete profileData['medium'];
        delete profileData['provider'];
        delete profileData['filterCtl'];
        delete profileData['providerFilter'];
        delete profileData['gradeFilter'];
        delete profileData['boardFilter'];
        delete profileData['mediumFilter'];
        delete profileData['subjectFilter'];

        return profileData;
    };

    //autocomplete fields
    onSelectChangeEvent(event, flag) {
        // switch (flag) {
        //   case "subject":
        //     this.formControls["subject"].setValue(event.subject);
        //     break;
        // }
    }

    // Helpers
    get formControls() {
        return this.profileForm.controls;
    }
}
