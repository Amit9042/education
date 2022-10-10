import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_SIZE_OPTIONS, RouteConstant } from '@sharedModule/constants';
import { CourseService } from '../../services';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { CourseModel } from '../../models';

@Component({
    selector: 'es-user-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
    // Data variables
    courseList: CourseModel[] = [];

    // Form control variables
    searchControl = new FormControl();

    // Pagination related variables
    page = 1;
    totalElements = 0;
    recordsPerPage = PAGE_SIZE_OPTIONS[0];

    // State Variables
    isLoadingResults = true;

    constructor(private router: Router, private courseService: CourseService) {}

    ngOnInit(): void {
        this.getUsersData();
    }

    // Initialisation methods
    getUsersData = () => {
        this.isLoadingResults = true;
        this.getUsersDataApiCall().subscribe(response => {
            let user = response['payload']?.user;
            if (!user) {
                this.updateUsersDataApiCall().subscribe(() => {
                    this.getInitialCourseList();
                });
            } else {
                this.getInitialCourseList();
            }
        });
    };

    getInitialCourseList = () => {
        this.searchControl.valueChanges
            .pipe(startWith(''), debounceTime(300), distinctUntilChanged())
            .subscribe(value => {
                this.page = 1;
                this.getProviderCourseList();
            });
    };

    getProviderCourseList = () => {
        this.getProviderCourseListApiCall().subscribe(response => {
            this.isLoadingResults = false;
            this.courseList = response['payload']['courses'];
            this.totalElements = response['pager']['totalRecords'];
        });
    };

    // Api Calls
    getProviderCourseListApiCall = () => {
        return this.courseService.getProviderCourseList(this.getQueryParams());
    };

    getUsersDataApiCall = () => {
        return this.courseService.getUsersData();
    };

    updateUsersDataApiCall = () => {
        return this.courseService.updateUsersData();
    };

    // Page events
    onPageChange = event => {
        this.page = event;
        this.getProviderCourseList();
    };

    onCreateCourse = () => {
        this.router.navigate(['/' + RouteConstant.CREATE_COURSE_TITLE]);
    };

    onEditCourse = (course: CourseModel) => {
        this.router.navigate([
            '/' + RouteConstant.EDIT_COURSE,
            course.course_id
        ]);
    };

    // Helper methods
    getQueryParams() {
        const params = {
            rowNumber: this.page,
            recordsPerPage: this.recordsPerPage
        };
        const search = {};
        if (this.searchControl.value) {
            search['title'] = this.searchControl.value;
        }
        if (Object.keys(search).length) {
            params['search'] = JSON.stringify(search);
        }
        return params;
    }

    getTotalDuration(seconds: number) {
        let hours;
        let minutes;
        hours = Math.floor(seconds / 3600);
        minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}hr ${minutes}m`;
    }
}
