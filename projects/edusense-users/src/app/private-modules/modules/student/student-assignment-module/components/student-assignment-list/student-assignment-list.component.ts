import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    AssignmentRedirect,
    PAGE_SIZE_OPTIONS,
    RouteConstant,
    SortingEnum,
    ViewType
} from '@sharedModule/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentAssignmentListModel } from '../../models';
import * as moment from 'moment';
import { StudentAssignmentService } from '../../services';
import { FormControl } from '@angular/forms';
import { getQueryParams } from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { EnterpriseDetail } from '../../../../../../public-modules/models';

@Component({
    selector: 'es-user-student-assignment-list',
    templateUrl: './student-assignment-list.component.html',
    styleUrls: ['./student-assignment-list.component.scss']
})
export class StudentAssignmentListComponent implements OnInit, OnDestroy {
    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;

    // Data variables
    studentAssignmentList: StudentAssignmentListModel[] = [];
    weekDateArray: { date; value; label }[] = [];
    selectedDate: string;
    todayDate = new Date();
    assignmentDate = new FormControl('');
    activeEnterprise: EnterpriseDetail;
    enterpriseList: EnterpriseDetail[] = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // State variable
    isSelectedDate = false;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private studentAssignmentService: StudentAssignmentService,
        private sharedService: SharedService
    ) {}

    ngOnInit() {
        this.enterpriseList = this.sharedService.getUserConfig().enterprise;
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.routeSubscriber();
        this.getWeekDateArray();
        this.getAssignmentListBasedOnSearch();
    }

    ngOnDestroy() {
        this.sharedService.setDateForAssignmentRedirection('');
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.studentAssignmentList) {
                this.studentAssignmentList = resolvedData.studentAssignmentList;
                this.currentViewType = this.studentAssignmentList.length
                    ? this.viewType.Data
                    : this.viewType.NoData;
            }
        });
    };

    getWeekDateArray = () => {
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date();
            let date = new Date(currentDate.setDate(currentDate.getDate() - i));
            let params = {
                index: i,
                date: date,
                label: moment(date).format('DD MMMM YYYY'),
                value: moment(date).format('YYYY-MM-DD')
            };
            this.weekDateArray.push(params);
        }
        this.setSelectDateParam();
    };

    setSelectDateParam = () => {
        let redirectedDate = this.sharedService.getDateForAssignmentRedirection();
        if (redirectedDate) {
            if (redirectedDate === AssignmentRedirect.All_ASSIGNMENT) {
                this.selectedDate = '';
            } else {
                let index = this.weekDateArray.findIndex(
                    record => record.value === redirectedDate
                );
                this.selectedDate = redirectedDate;
                if (index === -1) {
                    this.assignmentDate.setValue(new Date(redirectedDate));
                }
            }
        } else {
            this.selectedDate = this.weekDateArray[0].value;
        }
    };

    getAssignmentListBasedOnSearch = () => {
        this.assignmentDate.valueChanges.subscribe(value => {
            if (this.assignmentDate.value) {
                let date = moment(value).format('YYYY-MM-DD');
                this.getAssignmentList(date);
            }
        });
    };

    // API Calls
    studentAssignmentListApiCall = (value?: string) => {
        return this.studentAssignmentService.getStudentAssignmentList(
            value
                ? { showAll: true, date: value }
                : getQueryParams(
                      {},
                      {
                          active: 'startDate',
                          direction: SortingEnum.DESCENDING
                      },
                      this.rowNumber,
                      this.recordsPerPage
                  ),
            this.activeEnterprise.provider_uuid
        );
    };

    // Page events
    onClickWeekDays = (value: string) => {
        this.assignmentDate.setValue('');
        this.getAssignmentList(value);
    };

    getAssignmentList = (value: string) => {
        this.currentViewType = this.viewType.Loading;
        this.studentAssignmentListApiCall(value).subscribe(response => {
            this.studentAssignmentList = response['payload'];
            this.selectedDate = value;
            this.currentViewType = this.studentAssignmentList.length
                ? this.viewType.Data
                : this.viewType.NoData;
        });
    };

    getAllAssignmentList = (rowNumber: number) => {
        this.rowNumber = rowNumber;
        this.selectedDate = '';
        this.studentAssignmentListApiCall().subscribe(response => {
            this.assignmentDate.setValue('');
            this.totalElements = response.pager.totalRecords;
            if (this.rowNumber === 1) {
                this.studentAssignmentList = response['payload'];
            } else {
                const assignments: any[] = response.payload;
                this.studentAssignmentList = this.studentAssignmentList.concat(
                    assignments
                );
            }
            this.currentViewType = this.studentAssignmentList.length
                ? this.viewType.Data
                : this.viewType.NoData;
        });
    };

    onAssignmentCompletedView(assignment: StudentAssignmentListModel) {
        if (
            assignment.student_assignment &&
            assignment.student_assignment.student_assignment_id
        ) {
            this.router.navigate([
                '/' + RouteConstant.STUDENT_ASSIGNMENT_COMPLETED,
                assignment.assignment_id,
                assignment.student_assignment.student_assignment_id
            ]);
        } else {
            this.router.navigate([
                '/' + RouteConstant.STUDENT_ASSIGNMENT_VIEW,
                assignment.assignment_id
            ]);
        }
        this.sharedService.setAssignmentRedirectionData(
            this.selectedDate
                ? this.selectedDate
                : AssignmentRedirect.All_ASSIGNMENT
        );
    }

    onScroll = () => {
        const newRowNumber = this.rowNumber + this.recordsPerPage;
        if (newRowNumber <= this.totalElements && !this.selectedDate) {
            this.rowNumber = newRowNumber;
            this.getAllAssignmentList(this.rowNumber);
        }
    };

    // Helper methods
    getAssignmentStatus = (submittedAssignment: StudentAssignmentListModel) => {
        switch (
            submittedAssignment.student_assignment &&
            submittedAssignment.student_assignment.check_status
        ) {
            case 2:
                return 'Complete';
            case 3:
                return 'Incomplete';
            case 4:
                return `Partially complete`;
        }
    };

    getOverdueFlag = (submittedAssignment: StudentAssignmentListModel) => {
        let flag = false;
        let submissionDate = new Date(
            submittedAssignment.submission_date
        ).setHours(0, 0, 0, 0);
        let today = new Date().setHours(0, 0, 0, 0);
        if (today > submissionDate) {
            flag = true;
        }
        return flag;
    };
}
