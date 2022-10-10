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
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../../../user-management-module/models';
import { UsersService } from '../../../user-management-module/service';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-role-management-list',
    templateUrl: './role-management-list.component.html',
    styleUrls: ['./role-management-list.component.scss']
})
export class RoleManagementListComponent implements OnInit {
    // State Variables
    isShowFilter = false;

    // Data related variables
    displayedColumns = ['roleName', 'actionButtons'];
    dataSource = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    providerId;
    roleList: Role[] = [];

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _usersService: UsersService,
        private _mixpanelService: MixpanelService
    ) {}

    // Initialization method
    ngOnInit() {
        this.getRole();
        this._mixpanelService.track(MIXPANEL_EVENTS.ROLE_MANAG_LIST, {});
    }

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.initializeMethod();
    };

    initializeMethod = () => {};

    onRoleManagementView() {
        this.router.navigate(['/' + RouteConstant.ROLE_MANAGEMENT_VIEW]);
    }

    getRole = () => {
        this._usersService.getRoles(this.queryParams()).subscribe(response => {
            this.roleList = response['payload']['content'];
            this.dataSource = response['payload']['content'];
        });
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
