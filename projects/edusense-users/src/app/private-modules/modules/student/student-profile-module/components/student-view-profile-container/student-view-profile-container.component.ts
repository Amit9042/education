import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { ProfileDetailModel, UserDetail } from '../../models';
import { SharedUserService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-student-view-profile-container',
    templateUrl: './student-view-profile-container.component.html',
    styleUrls: ['./student-view-profile-container.component.scss']
})
export class StudentViewProfileContainerComponent implements OnInit {

    profileDetail: ProfileDetailModel = null;
    studentDetail = null;

    constructor(private router: Router, private _activeRoute: ActivatedRoute,
        private _sharedUserService: SharedUserService,
        private _mixpanelService: MixpanelService) {}

    ngOnInit() {
        const userData = this._sharedUserService.getUser();
        if (userData) {
            this.profileDetail = userData;
            this.studentDetail = this.profileDetail['user_details'];
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.PROFILE_VIEW_STUD, {});
    }

    onEditStudentProfile = () => {
        this.router.navigate([
            '/' + RouteConstant.STUDENT_PROFILE_DETAILS_EDIT
        ]);
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/studentProfile.svg';
    };
}
