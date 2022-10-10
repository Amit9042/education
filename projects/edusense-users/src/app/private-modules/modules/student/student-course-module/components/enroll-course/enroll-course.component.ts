import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentCoursesService } from 'edusense-users/src/app/private-modules/services/student-courses/student-courses.service';
import { SharedService } from '@sharedModule/services';
import { CourseModel, CoursePreviewModel, EnrollmentModel } from '../../../../provider/course-module/models';
import { CONTENT_TYPE, RouteConstant } from '@sharedModule/constants';
import { DurationFormatEnum, SuffixUnit } from '@sharedModule/pipes/duration.pipe';

@Component({
  selector: 'es-user-enroll-course',
  templateUrl: './enroll-course.component.html',
  styleUrls: ['./enroll-course.component.scss']
})

export class EnrollCourseComponent implements OnInit {

  courseId: number;
  providerUUID: string;
  courseData: { course: CourseModel, enrollment: EnrollmentModel, sections: CoursePreviewModel[], skills: [] };
  isLoadingResult = true;
  durationPattern = DurationFormatEnum;
  suffixUnit = SuffixUnit;
  contentType = CONTENT_TYPE;

  constructor(
    private studentCoursesService: StudentCoursesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.courseId = param.courseId
    });
    this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
    this.getCourseDetails();
  }

  getCourseDetails() {
    if (this.courseId) {
      this.studentCoursesService.getCourseDetails(this.courseId, { providerUUID: this.providerUUID }).subscribe(
        (response) => {
          this.isLoadingResult = false;
          this.courseData = response.payload;
          if (this.courseData.sections.length) {
            this.courseData.sections.sort(this.sortData);
            this.courseData.sections.forEach(section => {
              section.lectures.sort(this.sortData);
            });
          }
        },
        (error) => {
          this.isLoadingResult = false;
        }
      );
    }
  }

  sortData = (a, b) => {
    return a.sequence_no - b.sequence_no;
  }

  enrollIntoCourse() {
    if (this.courseData.enrollment?.enrollment_id) {
      this.routeToCourseDetailPage();
    } else {
      this.studentCoursesService.enrollIntoCourse(this.courseId, { providerUUID: this.providerUUID }).subscribe(
        (response) => {
          if (!this.courseData.enrollment) {
            this.courseData.enrollment = { enrollment_id: null };
          }
          this.courseData.enrollment.enrollment_id = response?.payload?.enrollment?.enrollment_id;
          this.routeToCourseDetailPage();
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  routeToCourseDetailPage() {
    this.router.navigate(['/' + RouteConstant.STUDENT_COURSE_DETAILS_CONTAINER, this.courseId, this.courseData.enrollment.enrollment_id]);
  }

  public get coverImageURL(): string {
    if (!this.isLoadingResult) {
      if (this.courseData?.course?.cover_image) {
        return 'url("' + this.courseData.course.cover_image + '")';
      } else {
        return 'url("assets/images/course-image.png")';
      }
    }
  }

  bookmarkCourse() {
    if (this.courseId) {
      this.studentCoursesService.bookMarkCourse({ providerUUID: this.providerUUID }, this.courseId).subscribe((response) => {
        this.courseData.course.is_bookmarked = <any>!this.courseData.course.is_bookmarked;
      });
    }
  }
}
