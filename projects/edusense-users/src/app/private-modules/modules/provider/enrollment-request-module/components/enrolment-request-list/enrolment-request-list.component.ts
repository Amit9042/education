import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignEnrollmentRequestDialogComponent } from '../assign-enrollment-request-dialog/assign-enrollment-request-dialog.component';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components';
import {
    EnrollmentStatusList,
    EnrollStatusEnum,
    PAGE_SIZE_OPTIONS,
    ViewType
} from '@sharedModule/constants';
import {
    StudentEnrolReqModel,
    EnrollmentListModel
} from '../../../../../models';
import { SharedService } from '@sharedModule/services';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { EnrolmentRequestService } from '../../services';
// @ts-ignore
import { Provider } from '../../../../../../public-modules/models';
import { EnrollmentRequestStudentViewDialogComponent } from '../enrollment-request-student-view-dialog/enrollment-request-student-view-dialog.component';
import { StudentService } from '../../../student-module/service';

@Component({
    selector: 'app-enrollment-request-list',
    templateUrl: './enrolment-request-list.component.html',
    styleUrls: ['./enrolment-request-list.component.scss']
})
export class EnrolmentRequestListComponent implements OnInit {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Loading;

    // Formcontrol variables
    searchControl = new FormControl();

    // Datasourse Variables
    provider: Provider = null;
    enrollmentList: EnrollmentListModel[] = [];
    enrollStatusVal = EnrollStatusEnum.ALL;

    enrollStatuses = EnrollStatusEnum;
    enrollStatusList = EnrollmentStatusList;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        public dialog: MatDialog,
        protected sharedService: SharedService,
        protected enrolReqService: EnrolmentRequestService,
        private _studentService: StudentService
    ) {}

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        const userConfig = this.sharedService.getUserConfig();
        if (userConfig.provider_list.length) {
            this.provider = userConfig.provider_list[0];
        }
        this.initSearchControl();
    }

    initSearchControl() {
        this.searchControl.valueChanges
            .pipe(startWith(''), debounceTime(300), distinctUntilChanged())
            .subscribe(value => {
                this.rowNumber = 1;
                this.getList();
            });
    }

    getListParams() {
        const params = {
            provider_id: this.provider.provider_id,
            showAll: false,
            rowNumber: this.rowNumber,
            recordsPerPage: this.recordsPerPage
        };
        const search = {};
        if (this.enrollStatusVal) {
            search['enrollment_status'] = this.enrollStatusVal;
        }
        if (this.searchControl.value) {
            search['name'] = this.searchControl.value;
        }
        if (Object.keys(search).length) {
            params['search'] = JSON.stringify(search);
        }
        return params;
    }

    getList() {
        this.currentViewType = ViewType.Loading;
        const params = this.getListParams();
        this.enrolReqService.enrollmentList(params).subscribe(response => {
            this.totalElements = response.pager.totalRecords;
            this.enrollmentList = response.payload;
            this.currentViewType = this.enrollmentList.length
                ? ViewType.Data
                : ViewType.NoData;
        });
    }

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params.rowNumber;
        this.recordsPerPage = +params.recordsPerPage;
        this.getList();
    };

    onAccept(enrllDetail: StudentEnrolReqModel) {
        const params = { request_id: enrllDetail.request_id };
        this.enrolReqService.enrollReqAccept(params).subscribe(response => {
            this.getList();
            this.onAssignEnrollmentRequestDialog(enrllDetail);
        });
    }

    onReject(requestId: number) {
        const params = { request_id: requestId };
        this.enrolReqService.enrollReqReject(params).subscribe(response => {
            this.getList();
        });
    }

    onAssignEnrollmentRequestDialog(enrllDetail: StudentEnrolReqModel): void {
        const dialogRef = this.dialog.open(
            AssignEnrollmentRequestDialogComponent,
            {
                panelClass: 'meeting-dialog-container',
                data: { enrllDetail, provider: this.provider }
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getList();
            }
        });
    }

    onOpenRejectDialog(requestId: number): void {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            data: {
                title: 'Confirmation',
                caption: 'Are you sure want to reject?',
                primaryButtonLabel: 'Reject',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(reject => {
            if (reject) {
                this.onReject(requestId);
            }
        });
    }

    openClassListDialog(enrllDetail) {
        this._studentService
            .getDetails({ provider_id: this.provider.provider_id }, enrllDetail.user_details.user_uuid)
            .subscribe(res => {
                const dialogRef = this.dialog.open(
                    EnrollmentRequestStudentViewDialogComponent,
                    {
                        panelClass: 'dialog-container',
                        data: { enrllDetail, userData: res['payload'] }
                    }
                );

                dialogRef.afterClosed().subscribe(result => {
                    if (result && result.isApiCall) {
                        this.getList();
                    }
                    if (result && result.enrllDetail) {
                        this.onAssignEnrollmentRequestDialog(enrllDetail);
                    }
                });
            });
    }
}
