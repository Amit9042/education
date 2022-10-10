import { Component, OnInit } from '@angular/core';
import { RouteConstant } from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// @ts-ignore
import { UserConfigModel } from '../../../../../../public-modules/models';
import { ClassesService } from '../../../classes-module/service';
import { ProviderChannelModel } from '@sharedModule/models';

@Component({
    selector: 'app-provider-streaming',
    templateUrl: './provider-streaming.component.html',
    styleUrls: ['./provider-streaming.component.scss']
})
export class ProviderStreamingComponent implements OnInit {
    // datasourse varibales
    classStreamingDetails: ProviderChannelModel = null;
    userDetails: UserConfigModel;
    intentionalEnd = false;
    constructor(
        protected sharedService: SharedService,
        protected classesService: ClassesService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.userDetails = this.sharedService.getUserConfig();
        this.classStreamingDetails = this.sharedService.getProviderChannel();
    }

    onClassEnd() {
        const params = {
            reference_id: this.classStreamingDetails.channel_name
        };
        this.classesService.leaveClass(params).subscribe(() => {
            this.sharedService.setProviderChannel(null);
            this.intentionalEnd = true;
            this.router.navigate([
                '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
            ]);
        });
    }

    onClassJoined() {
        const params = {
            class_uuid: this.classStreamingDetails.class_uuid,
            session_uuid: this.classStreamingDetails.channel_name
        };
        this.classesService.classJoined(params).subscribe((response) => {
            console.log('class joined : ', response);
        });
    }

    onStudentHandRaiseReq(): void {
        // const dialogRef = this.dialog.open(RaiseRequestComponent, {
        //     panelClass: 'raise-request-container'
        // });
        // dialogRef.afterClosed().subscribe((result) => {});
    }

    canDeactivate() {
        if (this.intentionalEnd) {
            return true;
        }
        return confirm('Are you sure want to end the class ?');
    }
}
