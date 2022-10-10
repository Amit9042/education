import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import {
    CommonRegexp,
    RouteConstant,
    UserTypeEnum,
    ValidationConstant,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { AuthenticationService, ProfileService } from '../../../../../services';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent extends FormBaseComponent implements OnInit {
    // Form group variables
    personalInfoForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(
        fb: FormBuilder,
        private router: Router,
        private _profileService: ProfileService,
        private _sharedService: SharedService,
        private _authernticationService: AuthenticationService,
        private _sharedUserService: SharedUserService,
        private _mixpanelService: MixpanelService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createPersonalInfoForm();
    };

    createPersonalInfoForm = () => {
        this.personalInfoForm = this.createForm({
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

    // Events
    onPersonalInfoFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const profileData = this._profileService.getBuildProfileData();
            const imagefile = profileData['logo'];
            const params = this.prepareRequestData(profileData, form.value);
            this._profileService
                .addUserProfileDetail(params, imagefile)
                .subscribe(response => {
                    this._authernticationService
                        .getProviderConfig()
                        .subscribe(res => {
                            this._sharedUserService.setUserConfig(res.payload);
                            this._profileService.setBuildProfileData(null);
                            this._sharedService.setLoggedInUserStatus(true);
                            this.getUserData(res.payload);
                            this._sharedService.setSignupType(
                                UserTypeEnum.STUDENT
                            );
                            this.router.navigate([
                                '/' +
                                    RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
                            ]);
                            this._mixpanelService.init(res.payload);
                            this._mixpanelService.track(
                                MIXPANEL_EVENTS.SIGNUP_BUILD_PROFILE,
                                res.payload
                            );
                        });
                });
        }
    };

    getUserData = user => {
        const id = user.provider_list[0]['provider_uuid'];
        this._authernticationService.getUserDetails(id).subscribe(respones => {
            this._sharedUserService.setUser(respones.payload);
        });
    };

    prepareRequestData = (profileData, formValue) => {
        const gradeList = [];
        const boardList = [];
        const mediumList = [];
        const subjectList = [];
        profileData.grade.forEach(element => {
            gradeList.push(element.grade_id);
        });
        profileData.board.forEach(element => {
            boardList.push(element.board_id);
        });
        profileData.medium.forEach(element => {
            mediumList.push(element.medium_id);
        });
        profileData.subject.forEach(element => {
            subjectList.push(element.subject_id);
        });
        profileData['grade_id'] = gradeList;
        profileData['board_id'] = boardList;
        profileData['medium_id'] = mediumList;
        profileData['subject_id'] = subjectList;

        profileData['provider_type_id'] = profileData.provider.provider_type_id;
        profileData['country_id'] = profileData.country.country_id;
        profileData['state_id'] = profileData.state.state_id;

        profileData['city_name'] = profileData['city'];
        profileData['provider_first_name'] = formValue['provider_first_name'];
        profileData['provider_last_name'] = formValue['provider_last_name'];
        profileData['provider_position'] = formValue['provider_position'];

        delete profileData['grade'];
        delete profileData['board'];
        delete profileData['subject'];
        delete profileData['medium'];
        delete profileData['provider'];
        delete profileData['country'];
        delete profileData['state'];
        delete profileData['city'];
        delete profileData['cityInput'];
        delete profileData['filterCtl'];
        delete profileData['logo'];
        return profileData;
    };

    onBack = () => {
        this.router.navigate(['/' + RouteConstant.BUILD_PROFILE]);
    };

    // Helpers
    get formControls() {
        return this.personalInfoForm.controls;
    }
}
