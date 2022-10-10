import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    RouteConstant,
    DAYS_LIST,
    PAGE_SIZE_OPTIONS,
    ViewType,
    MIXPANEL_EVENTS,
    OperatorEnum,
    UserTypeEnum
} from '@sharedModule/constants';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { Classes } from '@sharedModule/models';
import { hours24TimeConvert, userAllowed } from '@sharedModule/functions';
import { ClassesService } from '../../service';
import { forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ClassStudentsModel } from '../../../../../models';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { Role } from '../../../user-management-module/models';
import { UsersService } from '../../../user-management-module/service/users.service';

@Component({
    selector: 'app-class-view',
    templateUrl: './class-view.component.html',
    styleUrls: ['./class-view.component.scss']
})
export class ClassViewComponent implements OnInit {
    
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;

    // variables
    currentClassId: number;
    classDetail: Classes;
    studentList: ClassStudentsModel[] = [];

    // search control
    searchControl = new FormControl();

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    roleList: Role[] = [];

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _route: ActivatedRoute,
        private _classesService: ClassesService,
        private _sharedService: SharedService,
        private _mixpanelService: MixpanelService,
        private _usersService: UsersService
    ) {}

    ngOnInit() {
        this._route.paramMap.subscribe(params => {
            this.currentClassId = +params['params']['id'];
            this.callAPIs();
        });
        this.initSearchControl();
        this._mixpanelService.track(MIXPANEL_EVENTS.CLASS_DETAIL, {});
    }

    initSearchControl() {
        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(value => {
                this.rowNumber = 1;
                this.getStudentList();
            });
    }

    onClassList = () => {
        this.router.navigate(['/' + RouteConstant.CLASS_LIST]);
    };

    callAPIs() {
        forkJoin([
            this._classesService.getClassDetails(this.currentClassId),
            this._classesService.classStudentList(
                this.currentClassId,
                this.getStudentAPIParams()
            ),
            this._usersService.getRoles(this.queryParams())
        ]).subscribe(allResponse => {
            this.handleClassDetail(allResponse[0]);
            this.handleStudentDetail(allResponse[1]);
            this.handleRoleList(allResponse[2]['payload']['content']);
        });
    }

    handleClassDetail = response => {
        this.classDetail = response['payload'];
        if (this.classDetail.start_time) {
            this.classDetail.start_time = hours24TimeConvert(
                this.classDetail.start_time
            );
        }
        if (this.classDetail.end_time) {
            this.classDetail.end_time = hours24TimeConvert(
                this.classDetail.end_time
            );
        }
        this.classDetail.days_id = this.classDetail.days
            .map(e => e.day)
            .sort((a, b) => a - b);
        this.classDetail.days_name = this.classDetail.days_id.map(
            e => ' ' + DAYS_LIST.filter(v => v.id == e)[0].name
        );
        if (this.classDetail.days_name.length > 0) {
            this.classDetail.days_name = [
                this.classDetail.days_name.join(' - ')
            ];
        }
    };

    onOpenConfirmationDialog = (student: ClassStudentsModel) => {
        const isUserAllowed = userAllowed(this._sharedService);
        if (!isUserAllowed) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            panelClass: 'dialog-container',
            data: {
                title: 'Remove Student',
                caption:
                    'Are you sure you want to remove this student from the session?',
                primaryButtonLabel: 'Remove',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeStudentFromClass(
                    student.Student_detail.user.user_id
                );
            }
        });
    };

    getStudentAPIParams() {
        const params = {
            showAll: false,
            rowNumber: this.rowNumber,
            recordsPerPage: this.recordsPerPage
        };
        if (this.searchControl.value) {
            params['search'] = JSON.stringify({
                name: this.searchControl.value
            });
        }
        return params;
    }

    getStudentList() {
        this.currentViewType = this.viewType.Loading;
        this._classesService
            .classStudentList(this.currentClassId, this.getStudentAPIParams())
            .subscribe(response => {
                this.handleStudentDetail(response);
            });
    }

    handleStudentDetail = response => {
        this.totalElements = response.pager.totalRecords;
        this.studentList = response.payload;
        this.currentViewType = this.studentList.length
            ? this.viewType.Data
            : this.viewType.NoData;
    };

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params.rowNumber;
        this.recordsPerPage = +params.recordsPerPage;
        this.getStudentList();
    };

    removeStudentFromClass(userId: number) {
        const param = { class_id: this.currentClassId, user_ids: [userId] };
        this._classesService
            .removeStudentFromClass(param)
            .subscribe(response => {
                this.getStudentList();
            });
    }

    get teacherName() {
        return this.classDetail && this.classDetail.class_user_link.length > 0
            ? this.classDetail.class_user_link[0].user_master_detail
                  .first_name +
                  ' ' +
                  this.classDetail.class_user_link[0].user_master_detail
                      .last_name
            : '';
    }

    get getRoleName() {
        const id = this.classDetail && this.classDetail.class_user_link.length > 0 ? this.classDetail.class_user_link[0].user_master_detail.user_role.role_id : '';
        const data = this.roleList.find(e => e.id == id);
        return data ? data.name : '';
    };

    handleRoleList = list => {
        this.roleList = list; //response['payload']['content'];
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
