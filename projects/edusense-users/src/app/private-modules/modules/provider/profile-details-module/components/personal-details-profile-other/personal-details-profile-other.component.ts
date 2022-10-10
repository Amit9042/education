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
    selector: 'app-personal-details-profile-other',
    templateUrl: './personal-details-profile-other.component.html',
    styleUrls: ['./personal-details-profile-other.component.scss']
})
export class PersonalDetailsProfileOtherComponent extends FormBaseComponent
    implements OnInit {
    @Input() uploadeImage;

    userDetail: any;

    // Form group variables
    myControl = new FormControl();
    profileForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();
    config;
    providerId;

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
        if (this.config) {
            this.providerId = this.config['provider_list'][0]['provider_id'];
        }
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
            ]
        });
    };

    patchFormValue = () => {
        if (this.userDetail) {
            this.profileForm.patchValue({
                provider_first_name: this.userDetail['user']['first_name'],
                provider_last_name: this.userDetail['user']['last_name']
            });
        }
    };

    // Events
    onSubmitProfileForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const param = {
                first_name: form.value['provider_first_name'],
                last_name: form.value['provider_last_name'],
                provider_id: this.providerId
            };
            this._providerProfileService
                .updateProviderOtherProfile(param, this.uploadeImage)
                .subscribe(response => {
                    this.getProviderDetail();
                });
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

    onViewProfile = () => {
        this.router.navigate(['/' + RouteConstant.PROFILE_DETAILS_VIEW]);
    };

    // Helpers
    get formControls() {
        return this.profileForm.controls;
    }
}
