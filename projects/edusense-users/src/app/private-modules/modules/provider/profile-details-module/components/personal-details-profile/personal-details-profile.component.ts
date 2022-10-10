import { Component, OnInit, Input } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import {
    ValidationConstant,
    CommonRegexp,
    RouteConstant,
    RoleMaster
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { FormBaseComponent, SharedUserService } from '@sharedModule/index';
import { ProviderProfileService } from '../../services';
import { SharedService } from '../../../../../../shared-module/services/shared.service';

@Component({
    selector: 'app-personal-details-profile',
    templateUrl: './personal-details-profile.component.html',
    styleUrls: ['./personal-details-profile.component.scss']
})
export class PersonalDetailsProfileComponent extends FormBaseComponent
    implements OnInit {
    @Input() uploadeImage;

    userDetail: any;

    // Form group variables
    myControl = new FormControl();
    profileForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    config;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private _sharedUserService: SharedUserService,
        private _providerProfileService: ProviderProfileService,
        private _sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.config = this._sharedService.getUserConfig();
        this.initialize();
    }

    initialize = () => {
        this.userDetail = this._sharedUserService.getUser();
        this.createProfileForm();
        this.patchFormValue();
    };

    createProfileForm = () => {
        this.profileForm = this.createForm({
            provider_first_name: [
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
            provider_last_name: [
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
            provider_position: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ]
        });
    };

    patchFormValue = () => {
        if (this.userDetail) {
            this.profileForm.patchValue({
                provider_first_name: this.userDetail['provider_first_name'],
                provider_last_name: this.userDetail['provider_last_name'],
                provider_position: this.userDetail['provider_position']
            });
        }
    };

    // Events
    onSubmitProfileForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = this.prepareRequestData(form.value);
            if (
                this.config['user_role_link.role_id'] ===
                RoleMaster.PROVIDER_OWNER
            ) {
                this._providerProfileService
                    .updateProviderProfile(param, this.uploadeImage)
                    .subscribe(response => {
                        this.getProviderDetail();
                    });
            } else{
                this._providerProfileService
                .updateProviderOtherProfile(form.value)
                .subscribe(response => {
                    this.getProviderDetail();
                });   
            }
        }
    };

    getProviderDetail = () => {
        this._providerProfileService
            .getPoviderDetail(this.userDetail.provider_uuid)
            .subscribe(response => {
                this._sharedUserService.setUser(response.payload);
                this.onViewProfile();
            });
    };

    prepareRequestData = formValue => {
        const param = {};
        const gradeList = [];
        const boardList = [];
        const mediumList = [];
        const subjectList = [];

        this.userDetail.provider_grades.forEach(element => {
            gradeList.push(element.grade_id);
        });
        this.userDetail.provider_boards.forEach(element => {
            boardList.push(element.board_id);
        });
        this.userDetail.provider_mediums.forEach(element => {
            mediumList.push(element.medium_id);
        });
        this.userDetail.provider_subjects.forEach(element => {
            subjectList.push(element.subject_id);
        });

        param['grades'] = gradeList;
        param['boards'] = boardList;
        param['mediums'] = mediumList;
        param['subjects'] = subjectList;

        param['country_id'] = this.userDetail['country_id'];
        param['state_id'] = this.userDetail['state_id'];
        param['city_name'] = this.userDetail['city']['city_name'];
        param['address'] = this.userDetail['address'];
        param['provider_type_id'] = this.userDetail['provider_type_id'];
        param['name'] = this.userDetail['name'];

        param['provider_first_name'] = formValue['provider_first_name'];
        param['provider_last_name'] = formValue['provider_last_name'];
        param['provider_position'] = formValue['provider_position'];

        return param;
    };

    onViewProfile = () => {
        this.router.navigate(['/' + RouteConstant.PROFILE_DETAILS_VIEW]);
    };

    // Helpers
    get formControls() {
        return this.profileForm.controls;
    }
}
