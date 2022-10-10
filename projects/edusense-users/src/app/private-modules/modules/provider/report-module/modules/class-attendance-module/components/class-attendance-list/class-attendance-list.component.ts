import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { PAGE_SIZE_OPTIONS, RouteConstant } from '@sharedModule/constants';
import { ClassAttendanceModel } from '../../models';
import { queryParamsFunction } from '@sharedModule/functions';
import { ClassAttendanceService } from '../../services';
import { merge, throwError } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'es-user-class-attendance-list',
    templateUrl: './class-attendance-list.component.html',
    styleUrls: ['./class-attendance-list.component.scss']
})
export class ClassAttendanceListComponent implements OnInit {
    // Angular Variables
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Form Variables
    classNameFilterField: FormControl = new FormControl('');
    teacherFilterField: FormControl = new FormControl('');
    statusFilterField: FormControl = new FormControl('');
    startDateFilterField = new FormControl('');
    endDateFilterField = new FormControl('');

    // Data related variables
    displayedColumns = [
        'class_name',
        'teacher',
        'start_date',
        'end_date',
        'total',
        'present',
        'absent',
        'status',
        'action'
    ];
    providerId: number;
    attendanceList: ClassAttendanceModel[] = [];

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // state Variable
    isLoadingResults = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private classAttendanceService: ClassAttendanceService
    ) {}

    ngOnInit() {
        this.sortingAndSearchingChangeEvents();
    }

    // Initialisation methods
    sortingAndSearchingChangeEvents = () => {
        this.isLoadingResults = true;
        merge(
            this.sort.sortChange,
            this.classNameFilterField.valueChanges,
            this.teacherFilterField.valueChanges,
            this.startDateFilterField.valueChanges,
            this.endDateFilterField.valueChanges,
            this.statusFilterField.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.attendanceListApiCall();
                }),
                catchError(error => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleAttendanceListResponse(response);
            });
    };

    handleAttendanceListResponse = (response: any) => {
        this.attendanceList = response['payload']['list'];
        this.totalElements = response['pager']['totalRecords'];
        this.isLoadingResults = false;
    };

    // API Calls
    attendanceListApiCall = () => {
        return this.classAttendanceService.getAttendanceList(
            this.queryParams(this.sort, this.rowNumber, this.recordsPerPage)
        );
    };

    // Page Events
    onChangePagination = params => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getAttendanceList();
    };

    getAttendanceList = () => {
        this.isLoadingResults = true;
        this.attendanceListApiCall().subscribe(response => {
            this.handleAttendanceListResponse(response);
            this.isLoadingResults = false;
        });
    };

    onViewParentClass = (
        attendance: ClassAttendanceModel,
        attendedStudentStatus: number
    ) => {
        this.router.navigate([
            '/' + RouteConstant.CLASS_ATTENDANCE_VIEW,
            attendance.session_id,
            attendedStudentStatus
        ]);
    };

    onClearDateFilter = () => {
        this.startDateFilterField.setValue('');
    };

    onClearEndDateFilter = () => {
        this.endDateFilterField.setValue('');
    };

    // Helper methods
    getSessionStatus = (status: number) => {
        switch (status) {
            case 1:
                return 'Created';
            case 2:
                return 'Started';
            case 3:
                return 'Completed';
        }
    };

    queryParams = (sort?: any, rowNumber?: number, recordsPerPage?: number) => {
        let search = {};
        if (this.classNameFilterField.value) {
            search['className'] = this.classNameFilterField.value;
        }
        if (this.teacherFilterField.value) {
            search['teacherName'] = this.teacherFilterField.value;
        }
        if (this.startDateFilterField.value) {
            search['startTime'] = moment(this.startDateFilterField.value)
                .utc()
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (this.endDateFilterField.value) {
            search['endTime'] = moment(this.endDateFilterField.value)
                .utc()
                .subtract(1, 'seconds')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        if (this.statusFilterField.value) {
            search['sessionStatus'] = this.statusFilterField.value;
        }
        return queryParamsFunction(search, sort, rowNumber, recordsPerPage);
    };
}
