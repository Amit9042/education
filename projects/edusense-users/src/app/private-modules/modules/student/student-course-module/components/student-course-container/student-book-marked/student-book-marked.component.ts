import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant, PAGE_SIZE_OPTIONS } from '@sharedModule/constants';
import { StudentCoursesService } from 'edusense-users/src/app/private-modules/services/student-courses/student-courses.service';
import { getQueryParams } from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { DurationFormatEnum, SuffixUnit } from '@sharedModule/pipes/duration.pipe';
import { isNumber } from 'util';

@Component({
    selector: 'es-user-student-book-marked',
    templateUrl: './student-book-marked.component.html',
    styleUrls: ['./student-book-marked.component.scss']
})
export class StudentBookMarkedComponent implements OnInit {

    durationPattern = DurationFormatEnum;
    suffixUnit = SuffixUnit;
    providerUUID: string;
    bookMarkedCourses = [];
    requestParams = {};
    isLoadingResult = true;

    pageNumber = 0;  // PAGINATION
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    totalElements = 0;

    constructor(private router: Router,
        private studentCoursesService: StudentCoursesService,
        private sharedService: SharedService) { }

    ngOnInit(): void {
        this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
    }

    getAllBookmarkedList() {
        this.isLoadingResult = true;
        const rowNumber = (this.pageNumber * this.recordsPerPage) + 1;
        const params = {
            providerUUID: this.providerUUID,
            ...getQueryParams(this.requestParams, null, rowNumber, this.recordsPerPage)
        }
        this.studentCoursesService.getBookmarkedCourses(params).subscribe((response) => {
            this.isLoadingResult = false;
            this.bookMarkedCourses = response?.payload?.courses;
            this.totalElements = response?.pager?.totalRecords;
        });
    }

    routeToEnrollmentPage(courseId){
        this.router.navigate(['/' + RouteConstant.ENROLL_COURSE_CONTAINER,  courseId  ]);
    }

    setFilterParams(queryParams) {
        this.requestParams = queryParams;
        this.pageNumber = 0;
        this.getAllBookmarkedList();
    }

    removeBookmark(index, courseId) {
        this.studentCoursesService.bookMarkCourse({ providerUUID: this.providerUUID }, courseId).subscribe((response) => {
            this.bookMarkedCourses.splice(index, 1);
        });
    }

    onPageChange = event => {
        if (event && isNumber(event)) {
            this.pageNumber = event - 1 ;
            this.getAllBookmarkedList();
        }
    };
}
