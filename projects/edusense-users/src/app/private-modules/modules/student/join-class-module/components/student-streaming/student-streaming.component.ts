import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    ClassJoinStat,
    NotificationTemplate,
    RouteConstant
} from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { Router } from '@angular/router';
// @ts-ignore
import { UserConfigModel } from '../../../../../../public-modules/models';
import { StudentClassesService } from '../../../../../services';
import { PubnubService } from '@sharedModule/pubnub';
import { ClassChannelModel, Classes } from '@sharedModule/models';

@Component({
    selector: 'app-student-streaming',
    templateUrl: './student-streaming.component.html',
    styleUrls: ['./student-streaming.component.scss']
})
export class StudentStreamingComponent implements OnInit, OnDestroy {
    // static variables
    classJoinStat = ClassJoinStat;
    classDetails: Classes;

    // datasource variables
    classJoinClassDetails: ClassChannelModel = null;
    userDetails: UserConfigModel;

    // subscribe variables
    pubnubMsgReceive$: any;
    channUpdateReceiver$: any;

    providerUUID: string;

    constructor(
        protected sharedService: SharedService,
        protected pubnubService: PubnubService,
        protected studentClassesService: StudentClassesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
        this.userDetails = this.sharedService.getUserConfig();
        this.getChanneDetails();
        this.subsNotification();
        this.channUpdateReceiver$ = this.sharedService
            .getStudentChannelUpdate()
            .subscribe((result) => {
                if (result) {
                    this.getChanneDetails();
                }
            });
    }

    getChanneDetails() {
        this.classJoinClassDetails = this.sharedService.getStudentChannel();
        if (this.classJoinClassDetails) {
            this.getClassDetails();
        }
    }

    getClassDetails() {
        const params = { providerUUID: this.providerUUID}
        this.studentClassesService
            .getClassDetails(params, this.classJoinClassDetails.class_uuid)
            .subscribe((response) => {
                this.classDetails = response.payload;
            });
    }

    subsNotification() {
        this.pubnubService.setNotificationData(null);
        this.pubnubMsgReceive$ = this.pubnubService
            .getNotificationData()
            .subscribe((data) => {
                if (data) {
                    this.handleNotificationData(data.template, data.payload);
                }
            });
    }

    handleNotificationData(template: string, data: any) {
        switch (template) {
            case NotificationTemplate.PROVIDER_JOINED:
                this.onProviderJoined(data);
                break;
            case NotificationTemplate.PROVIDER_LEFT:
                this.onProviderLeft(data);
                break;
            default:
                break;
        }
    }

    onProviderJoined(data) {
        if (this.classJoinClassDetails.class_uuid === data.class_uuid) {
            this.classJoinClassDetails.status = data.status;
            this.classJoinClassDetails.channel_name = data.channel_name;
            this.classJoinClassDetails.meeting_token = data.meeting_token;
        }
    }

    onProviderLeft(data) {
        if (this.classJoinClassDetails.class_uuid === data.class_uuid) {
            this.classJoinClassDetails.status = ClassJoinStat.Left;
            this.classJoinClassDetails.channel_name = null;
            this.classJoinClassDetails.meeting_token = null;
            this.toDashboard();
        }
    }

    endClass() {
        this.leaveClass();
        this.toDashboard();
    };

    leaveClass() {
        if (this.classJoinClassDetails) {
            this.sharedService.setStudentChannel(null);
            const params = {
                reference_id: this.classJoinClassDetails.reference_id,
                providerUUID: this.providerUUID
            };
            this.classJoinClassDetails = null;
            this.studentClassesService.leaveClass(params).subscribe(() => {
            });
        }
    }

    toDashboard() {
        this.router.navigate([
            '/' + RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE
        ]);
    }

    ngOnDestroy(): void {
        this.leaveClass();
        this.sharedService.setStudentChannel(null);
        if (this.pubnubMsgReceive$) {
            this.pubnubMsgReceive$.unsubscribe();
            this.pubnubMsgReceive$ = null;
        }
        if (this.channUpdateReceiver$) {
            this.channUpdateReceiver$.unsubscribe();
            this.channUpdateReceiver$ = null;
            this.sharedService.setStudentChannelUpdate(false);
        }
    }
}
