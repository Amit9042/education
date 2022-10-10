import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { StudentCoursesService } from 'edusense-users/src/app/private-modules/services/student-courses/student-courses.service';
import { SharedService } from '@sharedModule/services';
import { getQueryParams } from '@sharedModule/functions';
import { DurationFormatEnum, SuffixUnit } from '@sharedModule/pipes/duration.pipe';
import { PAGE_SIZE_OPTIONS } from '@sharedModule/constants';
import { isNumber } from 'util';

@Component({
    selector: 'es-user-student-course-list',
    templateUrl: './student-course-list.component.html',
    styleUrls: ['./student-course-list.component.scss']
})
export class StudentCourseListComponent implements OnInit {

    durationPattern = DurationFormatEnum;
    suffixUnit = SuffixUnit;
    providerUUID: string;
    allCourseList = [];
    languageList = [];
    @Input() categoryId = null;
    requestParams;
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

    routeToEnrollpage(courseId) {
        this.router.navigate(['/' + RouteConstant.ENROLL_COURSE_CONTAINER, courseId]);
    }

    getAllCourseList() {
        this.isLoadingResult = true;
        const rowNumber = (this.pageNumber * this.recordsPerPage) + 1;
        const params = {
            providerUUID: this.providerUUID,
            ...getQueryParams(this.requestParams, null, rowNumber, this.recordsPerPage)
        }
        this.studentCoursesService.allCourseList(params).subscribe((response) => {
            this.isLoadingResult = false;
            this.allCourseList = response?.payload?.courses;
            this.totalElements = response?.pager?.totalRecords;
        });
    }

    setFilterParams(queryParams) {
        this.pageNumber = 0;
        this.requestParams = queryParams;
        this.getAllCourseList();
    }

    bookmarkCourse(index, courseId) {
        this.studentCoursesService.bookMarkCourse({ providerUUID: this.providerUUID }, courseId).subscribe((response) => {
            this.allCourseList[index].is_bookmarked = !this.allCourseList[index].is_bookmarked;
        });
    }

    onPageChange = event => {
        if (event && isNumber(event)) {
            this.pageNumber = event - 1 ;
            this.getAllCourseList();
        }
    };
}
