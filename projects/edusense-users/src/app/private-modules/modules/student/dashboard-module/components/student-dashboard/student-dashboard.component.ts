import { Component, OnInit } from '@angular/core';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { MIXPANEL_EVENTS } from '@sharedModule/constants';

@Component({
    selector: 'app-student-dashboard',
    templateUrl: './student-dashboard.component.html',
    styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
    constructor(private _mixpanelService: MixpanelService) {}

    ngOnInit() {
        this._mixpanelService.track(MIXPANEL_EVENTS.DASHBOARD_VIEW_STUD, {});
    }
}
