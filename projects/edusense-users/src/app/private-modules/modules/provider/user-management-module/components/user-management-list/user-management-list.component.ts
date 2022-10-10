import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    ViewType,
    OperatorEnum,
    UserTypeEnum,
    MIXPANEL_EVENTS
} from '@sharedModule/constants';
import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { merge } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../service';
import { getQueryParams, userAllowed } from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { Users, Role } from '../../models';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-user-management-list',
    templateUrl: './user-management-list.component.html',
    styleUrls: ['./user-management-list.component.scss']
})
export class UserManagementListComponent implements OnInit {
    
    // Form Variables
    nameFilterField = new FormControl('');
    emailFilterField = new FormControl('');
    roleFilterField = new FormControl('');
    actionFilterField = new FormControl('');

    // State Variables
    isLoadingResults = true;

    // Data related variables
    displayedColumns = ['name', 'email', 'role', 'action', 'actionButtons'];
    dataSource: Users[] = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    //
    providerId;
    roleList: Role[] = [];

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _usersService: UsersService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {}

    // Initialization method
    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        if (config) {
            this.providerId = config['provider_list'][0]['provider_id'];
        }
        this.initializeMethod(true);
        this.getRole();
        this._mixpanelService.track(MIXPANEL_EVENTS.USER_MANAG_LIST, {});
    }

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.initializeMethod(false);
    };

    initializeMethod = firstCall => {
        merge(
            this.nameFilterField.valueChanges,
            this.emailFilterField.valueChanges,
            this.roleFilterField.valueChanges,
            this.actionFilterField.valueChanges
        )
            .pipe(startWith({}), debounceTime(300))
            .subscribe(res => {
                this.getUserList(firstCall);
            });
    };

    getUserList = firstCall => {
        this.isLoadingResults = true;
        if (firstCall) {
            this.rowNumber = 1;
        }
        this._usersService
            .getlist({
                provider_id: this.providerId,
                ...getQueryParams(
                    this.getSearchParams(),
                    null,
                    this.rowNumber,
                    this.recordsPerPage
                )
            })
            .subscribe(
                response => {
                    this.handleUserList(response);
                    this.isLoadingResults = false;
                },
                err => {
                    this.isLoadingResults = false;
                }
            );
    };

    handleUserList = response => {
        this.dataSource = response['payload'];
        this.totalElements = response['pager']['totalRecords'];
    };

    getSearchParams() {
        const params = {};
        if (this.nameFilterField.value) {
            params['name'] = this.nameFilterField.value;
        }
        if (this.emailFilterField.value) {
            params['email'] = this.emailFilterField.value;
        }
        if (this.roleFilterField.value) {
            params['role_id'] = this.roleFilterField.value;
        }
        if (this.actionFilterField.value) {
            params['is_active'] = this.actionFilterField.value;
        }
        return params;
    }

    openInviteUserDialog() {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }

        this._mixpanelService.track(MIXPANEL_EVENTS.USER_MANAG_INVITE_VIEW, {});
        const dialogRef = this.dialog.open(InviteUserDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                providerId: this.providerId,
                roleList: this.roleList.filter(e => e.visible)
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod(true);
            }
        });
    }

    OpenEditUserDialog(userId) {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }

        this._mixpanelService.track(MIXPANEL_EVENTS.USER_MANAG_EDIT_VIEW, {});
        const dialogRef = this.dialog.open(EditUserDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                userId,
                providerId: this.providerId,
                roleList: this.roleList.filter(e => e.visible)
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeMethod(false);
            }
        });
    }

    onViewUser(id) {
        this.router.navigate(['/' + RouteConstant.USER_MANAGEMENT_VIEW, id]);
    }

    updateUserStatus = (toggleEnable, isEnable, userId) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            toggleEnable['checked'] = isEnable == 1 ? true : false;
            return;
        }
        const id = isEnable == 1 ? 0 : 1;
        this._usersService
            .updateUserStatus({}, userId, id)
            .subscribe(response => {
                this.initializeMethod(false);
            });
    };

    getRoleName = id => {
        const data = this.roleList.find(e => e.id == id);
        return data ? data.name : '';
    };

    getRole = () => {
        this._usersService.getRoles(this.queryParams()).subscribe(response => {
            this.roleList = response['payload']['content'];
        });
    };

    inviteResend = userId => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        this._usersService
            .inviteResend({ user_id: userId })
            .subscribe(response => {});
    };

    queryParams = (): any => {
        const criteriaArray = [];

        criteriaArray.push({
            column: 'applicationType',
            operator: OperatorEnum.EQUALS,
            values: [UserTypeEnum.PROVIDER]
        });

        criteriaArray.push({
            column: 'systemDefined',
            operator: OperatorEnum.TRUE
        });

        // criteriaArray.push({
        //     column: 'visible',
        //     operator: OperatorEnum.TRUE
        // });

        criteriaArray.push({
            column: 'active',
            operator: OperatorEnum.TRUE
        });

        return {
            offset: 0,
            limit: 100,
            criteria: criteriaArray
        };
    };
}
