import { Component, OnInit } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '@sharedModule/services';
import { userAllowed } from '@sharedModule/functions';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { ClassDetailsDialogComponent } from '../../../classes-module/components';
import { DashBoardService } from '../../services';

interface Dashboard {
    total_class:number,
    total_session:number,
    total_student:number
}

@Component({
    selector: 'lib-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    dashbordData: Dashboard;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService,
        private _dashBoardService: DashBoardService
    ) {}

    ngOnInit() {
        this._mixpanelService.track(MIXPANEL_EVENTS.DASHBOARD_VIEW, {});
        this.getData();
    }

    onCreateClassDialog(): void {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_ADD_VIEW, {});
        const dialogRef = this.dialog.open(ClassDetailsDialogComponent, {
            panelClass: 'create-class-dialog-container',
            data: { edit: false, classId: 0 }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.onClassList();
            }
        });
    }

    onStudentList = () => {
        this.router.navigate(['/' + RouteConstant.STUDENT_MODULE_ROUTE]);
    };

    onClassList = () => {
        this.router.navigate(['/' + RouteConstant.CLASSES_MODULE_ROUTE]);
    };

    onParentClassList = () => {
        this.router.navigate(['/' + RouteConstant.PARENT_CLASSES_MODULE_ROUTE]);
    };

    getData = () => {
        this._dashBoardService.getDashboardData().subscribe(res => {
            this.dashbordData = res['payload'];
        });
    };
}
