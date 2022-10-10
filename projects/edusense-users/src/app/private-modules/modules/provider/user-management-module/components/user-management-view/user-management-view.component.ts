import { Component, OnInit, Inject } from '@angular/core';
import { RouteConstant, OperatorEnum, UserTypeEnum, MIXPANEL_EVENTS, RoleMaster } from '@sharedModule/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../service';
import { Users, Role } from '../../models';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
    selector: 'app-user-management-view',
    templateUrl: './user-management-view.component.html',
    styleUrls: ['./user-management-view.component.scss']
})
export class UserManagementViewComponent implements OnInit {
    // variables
    currentUserId: number;
    userDetail: Users;
    roleList: Role[] = [];

    constructor(
        private router: Router,
        private _route: ActivatedRoute,
        private _usersService: UsersService,
        private _mixpanelService: MixpanelService
    ) {}

    ngOnInit() {
        this._route.paramMap.subscribe(params => {
            this.currentUserId = +params['params']['id'];
            this.getUserDetail();
        });
        this.getRole();
        this._mixpanelService.track(MIXPANEL_EVENTS.USER_MANAG_DETAIL, {});
    }

    onUserManagementList() {
        this.router.navigate(['/' + RouteConstant.USER_MANAGEMENT_LIST]);
    }

    getUserDetail = () => {
        this._usersService.getDetails({}, this.currentUserId).subscribe(res => {
            this.userDetail = res['payload'];
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

    get roleTeacher() {
        return RoleMaster.TEACHER;
    }
}
