import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    MIXPANEL_EVENTS,
    RoleMaster,
    RouteConstant,
    UserTypeEnum
} from '@sharedModule/constants';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { Router } from '@angular/router';
import { SharedService } from '@sharedModule/services';
import { userAllowed } from '@sharedModule/functions';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { UserConfigModel } from '../../public-modules/models';

@Component({
    selector: 'app-setting-drawer',
    templateUrl: './setting-drawer.component.html',
    styleUrls: ['./setting-drawer.component.scss']
})
export class SettingDrawerComponent implements OnInit {
    // Data variables
    @Output() clickEvent = new EventEmitter<boolean>();
    isUserManage = false;
    isRoleManage = false;
    config: UserConfigModel = null;
    userType = UserTypeEnum;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit() {
        this.config = this._sharedService.getUserConfig();
        if (
            this.config['user_role_link.role_id'] === RoleMaster.PROVIDER_OWNER
        ) {
            this.isUserManage = true;
            this.isRoleManage = true;
        }
    }

    onchangePassword(): void {
        this.clickEvent.emit(true);
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        if (this.config['user_role_link.role_id'] === RoleMaster.STUDNET) {
            this._mixpanelService.track(
                MIXPANEL_EVENTS.CHANGE_PASSWORD_STUD,
                {}
            );
        } else {
            this._mixpanelService.track(MIXPANEL_EVENTS.CHANGE_PASSWORD, {});
        }
        const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {});
    }

    onCloseDrawer() {
        this.clickEvent.emit(true);
    }

    onRoleManagement() {
        this.clickEvent.emit(true);
        this.router.navigate([
            '/' + RouteConstant.ROLE_MANAGEMENT_MODULE_ROUTE
        ]);
        this.clickEvent.emit(true);
    }

    onUserManagement() {
        this.router.navigate([
            '/' + RouteConstant.USER_MANAGEMENT_MODULE_ROUTE
        ]);
        this.clickEvent.emit(true);
    }

    onChapterManagement() {
        this.router.navigate([
            '/' + RouteConstant.CHAPTER_MANAGEMENT_MODULE_ROUTE
        ]);
        this.clickEvent.emit(true);
    }
}
