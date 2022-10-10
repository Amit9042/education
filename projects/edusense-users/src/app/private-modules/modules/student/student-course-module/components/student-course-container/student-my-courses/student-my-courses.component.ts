import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_SIZE_OPTIONS, RouteConstant } from '@sharedModule/constants';
import { StudentCoursesService } from 'edusense-users/src/app/private-modules/services/student-courses/student-courses.service';
import { SharedService } from '@sharedModule/services';
import { getQueryParams } from '@sharedModule/functions';
import { DurationFormatEnum, SuffixUnit } from '@sharedModule/pipes/duration.pipe';
import { isNumber } from 'util';

@Component({
  selector: 'es-user-student-my-courses',
  templateUrl: './student-my-courses.component.html',
  styleUrls: ['./student-my-courses.component.scss']
})
export class StudentMyCoursesComponent implements OnInit {

  durationPattern = DurationFormatEnum;
  suffixUnit = SuffixUnit;
  providerUUID: string;
  studentCourseList = [];
  isLoadingResult = true;
  requestParams = {};

  pageNumber = 0;  // PAGINATION
  recordsPerPage = PAGE_SIZE_OPTIONS[0];
  totalElements = 0;

  constructor(private router: Router,
    private studentCoursesService: StudentCoursesService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
  }

  routeToCourseDetailContainer(courseId, enrollmentId) {
    this.router.navigate(['/' + RouteConstant.STUDENT_COURSE_DETAILS_CONTAINER, courseId, enrollmentId]);
  }

  setFilterParams(queryParams) {
    this.requestParams = queryParams;
    this.pageNumber = 0;
    this.getStudentCourseList();
  }

  getStudentCourseList() {
    this.isLoadingResult = true;
    const rowNumber = (this.pageNumber * this.recordsPerPage) + 1;
    const params = {
        providerUUID: this.providerUUID,
        ...getQueryParams(this.requestParams, null, rowNumber, this.recordsPerPage)
    }
    this.studentCoursesService.studentCourseList(params).subscribe((response) => {
      this.isLoadingResult = false;
      this.studentCourseList = response?.payload?.courses;
      this.totalElements = response?.pager?.totalRecords;
    })
  }

  onPageChange = event => {
    if (event && isNumber(event)) {
        this.pageNumber = event - 1 ;
        this.getStudentCourseList();
    }
};
}
