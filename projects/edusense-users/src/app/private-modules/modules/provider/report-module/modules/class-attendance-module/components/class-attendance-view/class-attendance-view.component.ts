import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_SIZE_OPTIONS, RouteConstant } from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';
import {
    AttendedStudentModel,
    ClassAttendanceModel,
    StudentSessionHistoryModel
} from '../../models';
import { SesstionHistoryDialogComponent } from '../sesstion-history-dialog/sesstion-history-dialog.component';
import { FormControl } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { ClassAttendanceService } from '../../services';
import { getTotalDuration, queryParamsFunction } from '@sharedModule/functions';

@Component({
    selector: 'es-user-class-attendance-view',
    templateUrl: './class-attendance-view.component.html',
    styleUrls: ['./class-attendance-view.component.scss']
})
export class classAttendanceViewComponent implements OnInit {
    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    // Data related variables
    // displayedColumns = ['student', 'duration', 'present', 'reason', 'remarks'];
    displayedColumns = ['student', 'duration', 'present'];
    attendanceDetails: ClassAttendanceModel;
    attendedStudentsList: AttendedStudentModel[] = [];
    participatedStudentStatus: number;

    // Form variables
    searchByName = new FormControl();

    // state Variable
    isLoadingResults = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private classAttendanceService: ClassAttendanceService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routeSubscriber();
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.participatedStudentStatus = +this.activeRoute.snapshot.params[
            'sNum'
        ];
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.attendanceDetails) {
                this.attendanceDetails = resolvedData['attendanceDetails'];
                this.searchingChangeEvents();
            }
        });
    };

    searchingChangeEvents = () => {
        this.isLoadingResults = true;
        this.searchByName.valueChanges
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    return this.attendedStudentsListApiCall();
                }),
                catchError(error => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.isLoadingResults = false;
                this.attendedStudentsList = response['payload']['data'];
            });
    };

    // API calls
    attendedStudentsListApiCall = () => {
        return this.classAttendanceService.getAttendedStudentsList({
            ...{ sessionId: +this.attendanceDetails.session_id },
            ...this.queryParams()
        });
    };

    studentSessionHistoryApiCall = (sId: number) => {
        return this.classAttendanceService.getStudentSessionHistory({
            sessionId: +this.attendanceDetails.session_id,
            studentId: sId
        });
    };

    // Page events
    onGetAttendedStudentList = (status: number) => {
        if (this.participatedStudentStatus !== status) {
            this.isLoadingResults = true;
            this.participatedStudentStatus = status;
            this.attendedStudentsListApiCall().subscribe(response => {
                this.isLoadingResults = false;
                this.attendedStudentsList = response['payload']['data'];
            });
        }
    };

    onAttendanceList = () => {
        this.router.navigate(['/' + RouteConstant.CLASS_ATTENDANCE_LIST]);
    };

    onSessionHistory = (student: AttendedStudentModel) => {
        this.studentSessionHistoryApiCall(
            student.user_details.user_id
        ).subscribe(response => {
            this.openSessionDialog(response['payload']);
        });
    };

    openSessionDialog = (session: StudentSessionHistoryModel) => {
        const dialogRef = this.dialog.open(SesstionHistoryDialogComponent, {
            panelClass: 'session-history-dialog',
            data: { sessionHistory: session }
        });

        dialogRef.afterClosed().subscribe(result => {});
    };

    onScroll = () => {};

    // Helper methods
    getDuration(seconds: number) {
        return getTotalDuration(seconds);
    }

    queryParams = () => {
        let search = {};
        if (this.searchByName.value) {
            search['studentName'] = this.searchByName.value;
        }
        if (this.participatedStudentStatus <= 1) {
            search['isPresent'] = this.participatedStudentStatus;
        }
        return queryParamsFunction(search, null, null, null, true);
    };
}
