import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant, PAGE_SIZE_OPTIONS } from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';
import { StudentPracticeReportViewDialogComponent } from '../student-practice-report-view-dialog/student-practice-report-view-dialog.component';
import { StudentPracticeReportService } from '../../services';
import { PracticeReportModel } from '../../models/practice-report.model';
import { merge, throwError } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'es-user-student-practice-report-list',
    templateUrl: './student-practice-report-list.component.html',
    styleUrls: ['./student-practice-report-list.component.scss']
})
export class StudentPracticeReportListComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Data related variables
    displayedColumns = [
        'username',
        'contactNumber',
        'gradeAlias',
        'subjectName',
        'practiceName',
        'finishedAt',
        'totalMarks',
        'obtainMarks',
        'action'
    ];

    studentNameFilterField: FormControl = new FormControl('');
    contactNumberFilterField: FormControl = new FormControl('');
    gradeFilterField: FormControl = new FormControl('');
    subjectFilterField: FormControl = new FormControl('');
    practiceNameFilterField: FormControl = new FormControl('');
    totalMarksFilterField: FormControl = new FormControl('');
    obtainMarksFilterField: FormControl = new FormControl('');
    dateFilterField = new FormControl('');

    practiceListData: PracticeReportModel[] = [];

    // State Variables
    isShowFilter = false;
    isLoadingResult = false;

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _studentPracticeReportService: StudentPracticeReportService
    ) {}

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.isLoadingResult = true;
        merge(
            this.sort.sortChange,
            this.studentNameFilterField.valueChanges,
            this.contactNumberFilterField.valueChanges,
            this.gradeFilterField.valueChanges,
            this.subjectFilterField.valueChanges,
            this.practiceNameFilterField.valueChanges,
            this.totalMarksFilterField.valueChanges,
            this.obtainMarksFilterField.valueChanges,
            this.dateFilterField.valueChanges
        )
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.getReport();
                }),
                catchError((error) => {
                    this.isLoadingResult = false;
                    return throwError(error);
                })
            )
            .subscribe((response) => {
                this.handlePracticeListResponse(response);
            });
    };

    getReport = () => {
        const params = this.queryParams();
        return this._studentPracticeReportService.getPracticeReportList(params);
    };

    handlePracticeListResponse = (response) => {
        this.isLoadingResult = false;
        this.practiceListData = response.payload.content;
        this.totalElements = response.payload.pageable.totalElements;
    };

    openViewStudentPracticeReport = (data) => {
        this._studentPracticeReportService.getPracticeResult(data.userId, data.practiceId).subscribe(res => {
            const practiceResult = res.payload;
            practiceResult['practiseName'] = data.practiceName;
            practiceResult['userName'] = data.userName;
            this.openDialog(practiceResult);
        })
        
    };

    openDialog = (data) => {
        const dialogRef = this.dialog.open(
            StudentPracticeReportViewDialogComponent,
            {
                panelClass: 'dialog-container',
                data: data
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Page Events
    onChangePagination = (params) => {
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getReport().subscribe(response => this.handlePracticeListResponse(response));
    };

    queryParams = () => {
        let params = {};
        if (this.studentNameFilterField.value) {
            params['userName'] = this.studentNameFilterField.value;
        }
        if (this.contactNumberFilterField.value) {
            params['contactNumber'] = this.contactNumberFilterField.value;
        }
        if (this.gradeFilterField.value) {
            params['grade'] = this.gradeFilterField.value;
        }
        if (this.subjectFilterField.value) {
            params['subject'] = this.subjectFilterField.value;
        }
        if (this.practiceNameFilterField.value) {
            params['practiceName'] = this.practiceNameFilterField.value;
        }
        if (this.totalMarksFilterField.value) {
            params['totalMarks'] = +this.totalMarksFilterField.value;
        }
        if (this.obtainMarksFilterField.value) {
            params['obtainMarks'] = +this.obtainMarksFilterField.value;
        }
        if (this.dateFilterField.value) {
            params['finishedStartDate'] = moment(this.dateFilterField.value)
                .startOf('day')
                .utc();
            params['finishedEndDate'] = moment(this.dateFilterField.value)
                .endOf('day')
                .utc();
        }

        if (this.sort && this.sort.active && this.sort.direction) {
            params['sortOrder'] = this.sort.direction;
            params['sortBy'] = this.sort.active;
        }

        params['offset'] = this.rowNumber - 1;
        params['limit'] = this.recordsPerPage;
        return params;
    };

    onClearDateFilter = () => {
        this.dateFilterField.setValue('');
    };
}
