import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonRegexp, CONTENT_TYPE } from '@sharedModule/constants';
import { getVideoDuration } from '@sharedModule/functions/common-functions';
import { SharedService } from '@sharedModule/services';
import { StudentCoursesService } from 'edusense-users/src/app/private-modules/services/student-courses/student-courses.service';
import { CourseLecturesModel, CourseModel, CoursePreviewModel } from '../../../../provider/course-module/models';
import { StudentLectureModel } from '../../models/course-detail.model';

@Component({
  selector: 'es-user-student-course-details-container',
  templateUrl: './student-course-details-container.component.html',
  styleUrls: ['./student-course-details-container.component.scss']
})

export class StudentCourseDetailsContainerComponent implements OnInit {

  enrollmentId: number;
  courseId: number;
  providerUUID: string;
  courseData: CourseModel;
  contentType = CONTENT_TYPE;
  type = null;

  lectureId: number;
  contentList: CoursePreviewModel[] = [];
  lectureDetail: CourseLecturesModel;
  studentLecture: StudentLectureModel;

  currentTime = 0;
  tempCurrentTime = 0;
  videoLoadTime = 0;

  youtubeUrl;
  progressTimer;

  sectionIndex = 0;
  lectureIndex = 0;
  courseSkillList: string[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private studentCoursesService: StudentCoursesService,
    private domSanitizer: DomSanitizer,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.courseId = param.courseId
      this.enrollmentId = param.enrollmentId
    });
    this.providerUUID = this.sharedService.getActiveEnterprise().provider_uuid;
    this.progressTimer = setInterval(() => {
      this.callUpdateLectureProgressAPI();
    }, 5000);
    this.initialize();
  }

  initialize() {
    this.getCourseDetails();
    this.getLectureList();
  }

  callUpdateLectureProgressAPI() {
    const totalDuration = this.lectureDetail?.lecture_content?.content_duration;
    switch (this.type) {
      case this.contentType.VIDEO:
        const time = Math.floor(this.currentTime);
        if (time && this.tempCurrentTime !== this.currentTime && time <= totalDuration) {
          this.tempCurrentTime = this.currentTime;
          this.updateLectureProgress();
        }
        break;
      case this.contentType.TEXT:
        if (!this.studentLecture?.is_completed && !totalDuration) { // when time is not added by provider then need to set is_complete flag
          this.currentTime = 1;
          this.updateLectureProgress();
          break;
        }
        if (this.currentTime < totalDuration) {
          this.currentTime = this.currentTime + 5 > totalDuration ? totalDuration : this.currentTime + 5;
          this.updateLectureProgress();
        } else if (this.currentTime > totalDuration) {
          this.currentTime = totalDuration;
          this.updateLectureProgress();
        }
        break;
      case this.contentType.FILE:
      case this.contentType.YOUTUBE_LINK:
        if (!this.studentLecture?.is_completed) {
          this.currentTime = 1;
          this.updateLectureProgress();
        }
        break;
    }

  }

  getCourseDetails() {
    this.studentCoursesService.getCourseDetails(this.courseId, { providerUUID: this.providerUUID }).subscribe((response) => {
      this.courseData = response.payload?.course;
      this.courseSkillList = response.payload?.skills;
    });
  }

  getLectureList() {
    this.studentCoursesService.lectureList(this.enrollmentId).subscribe((response) => {
      this.contentList = response.payload.sections;
      this.contentList.sort(this.sortData);
      this.contentList.forEach(section => {
        section.completedCourse = 0;
        section.lectures.sort(this.sortData);
        section.lectures.forEach(lecture => {
          if (lecture?.student_lecture?.is_completed)
            section.completedCourse++;
        })
      });
      const lectureId = this.contentList[0]?.lectures[0]?.lecture_id;
      this.selectLecture(lectureId, this.sectionIndex, this.sectionIndex);
    });
  }

  sortData = (a, b) => {
    return a.sequence_no - b.sequence_no;
  }

  selectLecture(lectureId: number, sectionIndex: number, lectureIndex: number) {
    if (this.lectureId !== lectureId) {
      this.type = null; // SET NULL BECAUSE VIDEO IS NOT REFLECTING 
      this.lectureId = lectureId;
      this.sectionIndex = sectionIndex;
      this.lectureIndex = lectureIndex;
      this.getLectureDetail();
    }
  }

  getLectureDetail() {
    this.studentCoursesService.lectureDetail(this.enrollmentId, this.lectureId).subscribe((response) => {
      this.videoLoadTime = 0; this.tempCurrentTime = 0, this.currentTime = 0;
      this.lectureDetail = response.payload.lecture;
      this.studentLecture = response.payload.studentLecture;
      this.type = this.lectureDetail?.lecture_content?.content_type;

      const lectureProgress = this.studentLecture.lecture_progress;
      if (lectureProgress) {
        this.videoLoadTime = lectureProgress;
        this.currentTime = lectureProgress;
        this.tempCurrentTime = lectureProgress;
      }

      if (this.type === this.contentType.YOUTUBE_LINK) {
        const match = this.lectureDetail.lecture_content.content_path.match(CommonRegexp.LINK_REGEXP);
        this.youtubeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${match[1]}`);
      }
    });
  }

  bookmarkCourse() {
    this.studentCoursesService.bookMarkCourse({ providerUUID: this.providerUUID }, this.courseId).subscribe((response) => {
      this.courseData.is_bookmarked = <any>!this.courseData.is_bookmarked;
    });
  }

  updateLectureProgress() {
    const params = { progress: Math.floor(this.currentTime) };
    console.log(params);

    this.studentCoursesService.updateLectureProgress(this.enrollmentId, this.lectureId, params).subscribe((response) => {
      const isLectureCompteted = response?.payload?.studentLecture?.is_completed;
      if (isLectureCompteted && !this.contentList[this.sectionIndex]?.lectures[this.lectureIndex]?.student_lecture?.is_completed) {
        if (!this.contentList[this.sectionIndex].lectures[this.lectureIndex]?.student_lecture?.is_completed) {
          this.contentList[this.sectionIndex].lectures[this.lectureIndex].student_lecture = <any>{ is_completed: null }
        }
        this.contentList[this.sectionIndex].lectures[this.lectureIndex].student_lecture.is_completed = isLectureCompteted;
        this.contentList[this.sectionIndex].completedCourse++;
      }
      // if seconds not added by provider (for text,file and link) and course progerss update then stop repeat API call(condition checked in switch case of callUpdateLectureProgressAPI).
      this.studentLecture.is_completed = isLectureCompteted;
      if (!this.lectureDetail?.lecture_content?.content_duration) {
        this.lectureDetail.lecture_content.content_duration = response?.payload?.studentLecture?.lecture_progress;
      }
    });
  }


  getDuration(secondParam: number = 0) {
    return getVideoDuration(secondParam);
  }

  videoEvent(event) {
    this.currentTime = event.target.currentTime;
  }

  ngOnDestroy(): void {
    this.callUpdateLectureProgressAPI();
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
  }
}
