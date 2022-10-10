import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@sharedModule/services';
import { Location } from '@angular/common';
import { RecordedService } from '../../services';
import { EnterpriseDetail } from '../../../../../../public-modules/models';
@Component({
    selector: 'es-user-student-recorded-view',
    templateUrl: './student-recorded-view.component.html',
    styleUrls: ['./student-recorded-view.component.scss']
})
export class StudentRecordedViewComponent implements OnInit, OnDestroy {
    sessionDetail: any = null;
    activeEnterprise: EnterpriseDetail;

    constructor(
        private router: Router,
        protected sharedService: SharedService,
        private _recordedService: RecordedService,
        protected location: Location
    ) {}

    ngOnInit(): void {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.getSessionDetails();
    }

    getSessionDetails() {
        const recId = this.sharedService.getRecordingSessionId();
        this._recordedService
            .getRecordedDetail(recId, {
                providerUUID: this.activeEnterprise['provider_uuid']
            })
            .subscribe((response) => {
                this.sessionDetail = response.payload;
            });
    }

    onRecordedlList = () => {
        this.location.back();
    };

    ngOnDestroy(): void {
        this.sharedService.setRecordingSessionId(0);
    }
}
