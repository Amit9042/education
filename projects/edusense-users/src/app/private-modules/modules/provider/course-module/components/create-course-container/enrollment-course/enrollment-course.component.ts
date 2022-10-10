import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PAGE_SIZE_OPTIONS } from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { StudentEnrollService } from 'edusense-users/src/app/private-modules/services';
import { merge, throwError } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { EnrolledStudentsModel } from '../../../models';

@Component({
    selector: 'es-user-enrollment-course',
    templateUrl: './enrollment-course.component.html',
    styleUrls: ['./enrollment-course.component.scss']
})
export class EnrollmentCourseComponent implements OnInit {
    // Angular Variables
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @Output() onChangeStep = new EventEmitter();
    @Output() emitUserData = new EventEmitter();
    @Input('courseId') courseId;

    // State Variables
    isLoadingResults = true;

    // Form Variables
    nameFilterField: FormControl = new FormControl('');
    enrolledFilterField: FormControl = new FormControl('');
    lastVisitedFilterField: FormControl = new FormControl('');

    // Data related variables
    displayedColumns = [
        'student_name',
        'createdAt',
        'updatedAt',
        'course_progress'
    ];
    dataSource: EnrolledStudentsModel[] = [];
    providerId: number;
    sortOrder = 'desc';
    sortBy = 'createdAt';

    // Pagination related variables
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private _sharedService: SharedService,
        private studentEnrollService: StudentEnrollService
    ) {}

    ngOnInit() {
        const config = this._sharedService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];
        this.initializeMethod();
    }

    // Initialisation methods
    initializeMethod = () => {
        // this.isLoadingResults = false;
        merge(this.sort.sortChange, this.nameFilterField.valueChanges)
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(() => {
                    this.rowNumber = 1;
                    return this.getEnrolledCourseList();
                }),
                catchError(error => {
                    this.isLoadingResults = false;
                    return throwError(error);
                })
            )
            .subscribe(response => {
                this.handleEnrolledStudentList(
                    response?.payload?.students,
                    response['pager']
                );
                this.isLoadingResults = false;
            });
    };

    handleEnrolledStudentList = (studentList, pager) => {
        this.dataSource = studentList;
        this.totalElements = pager['totalRecords'];
    };

    // Api calls
    getEnrolledCourseList = () => {
        return this.studentEnrollService.enrolledStudentsList(
            this.getQueryParams(this.sort)
        );
    };

    // Page Events
    getEnrolledCourseData = () => {
        this.getEnrolledCourseList().subscribe(response => {
            this.handleEnrolledStudentList(
                response?.payload?.students,
                response['pager']
            );
            this.isLoadingResults = false;
        });
    };

    onChangePagination = params => {
        this.isLoadingResults = true;
        this.rowNumber = +params['rowNumber'];
        this.recordsPerPage = +params['recordsPerPage'];
        this.getEnrolledCourseData();
    };

    onClickNext = (userData:EnrolledStudentsModel ) => {
        this.onChangeStep.emit('enrollment-student');
        this.emitUserData.emit(userData);
    };

    // Helper methods
    getQueryParams(sort) {
        const params = {
            courseId: this.courseId,
            rowNumber: this.rowNumber,
            recordsPerPage: this.recordsPerPage
        };
        const search = {};
        if (this.nameFilterField?.value) {
            search['studentName'] = this.nameFilterField.value;
        }
        if (Object.keys(search).length) {
            params['search'] = JSON.stringify(search);
        }
        if (sort && sort.active && sort.direction) {
            params['sortOrder'] = sort.direction;
            params['sortBy'] = sort.active;
        }
        return params;
    }
}
