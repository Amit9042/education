import { Component, Input, OnInit } from '@angular/core';
import { CourseModel } from 'edusense-users/src/app/private-modules/modules/provider/course-module/models';
import { CourseDetail } from '../../../models/course-detail.model';

@Component({
  selector: 'es-user-student-course-about-details',
  templateUrl: './student-course-about-details.component.html',
  styleUrls: ['./student-course-about-details.component.scss']
})
export class StudentCourseAboutDetailsComponent implements OnInit {

  @Input() courseData: CourseModel;
  @Input() courseSkillList: string[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
