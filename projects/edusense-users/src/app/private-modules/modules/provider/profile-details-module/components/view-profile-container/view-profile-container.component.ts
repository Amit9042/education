import { Component, OnInit } from '@angular/core';
import { RouteConstant, RoleMaster, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { ProviderProfileService } from '../../services';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { userAllowed } from '@sharedModule/functions';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-view-profile-container',
    templateUrl: './view-profile-container.component.html',
    styleUrls: ['./view-profile-container.component.scss']
})
export class ViewProfileContainerComponent implements OnInit {
    userData = null;
    isOwner = false;
    userName = '';

    constructor(
        private router: Router,
        private _sharedService: SharedService,
        private _sharedUserService: SharedUserService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        if (config['user_role_link.role_id'] === RoleMaster.PROVIDER_OWNER) {
            this.isOwner = true;
        }
        this.userData = this._sharedUserService.getUser();
        this.userName = this.isOwner 
                ? `${this.userData.provider_first_name} ${this.userData.provider_last_name}` 
                : `${this.userData.user.first_name} ${this.userData.user.last_name}`;
        this._mixpanelService.track(MIXPANEL_EVENTS.PROFILE_VIEW, {});
    }

    onEditProfileDetails = () => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this.router.navigate(['/' + RouteConstant.PROFILE_DETAILS_EDIT]);
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/providerProfile.svg';
    };
}
