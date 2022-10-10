import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { LectureResourcesModel } from 'edusense-users/src/app/private-modules/modules/provider/course-module/models';
import { StudentCoursesService } from 'edusense-users/src/app/private-modules/services/student-courses/student-courses.service';
import { downloadDocument } from '@sharedModule/functions/common-functions';
import { ALLOWED_MATERIAL_FILE_TYPES } from '@sharedModule/constants';

@Component({
  selector: 'es-user-student-course-resources-details',
  templateUrl: './student-course-resources-details.component.html',
  styleUrls: ['./student-course-resources-details.component.scss']
})
export class StudentCourseResourcesDetailsComponent implements OnInit {

  @Input() enrollmentId: number;
  @Input() lectureId: number;
  resourceList: LectureResourcesModel[] = [];
  fileTypeList = ALLOWED_MATERIAL_FILE_TYPES;

  constructor(
    private studentCoursesService: StudentCoursesService
  ) { }

  ngOnInit(): void {
  }

  getResources() {
    this.studentCoursesService.resourceList(this.enrollmentId, this.lectureId).subscribe((response) => {
      this.resourceList = response.payload.resources;
    });
  }

  resourceDownload(index) {
    const path = this.resourceList[index].content_path;
    const fileName = this.resourceList[index].title;
    downloadDocument(path, fileName);
  } 

  ngOnChanges(changes: SimpleChanges): void {
    if (this.enrollmentId && this.lectureId) {
      this.getResources();
    }
  }

  getFileIcon = (type: string) => {
    return this.fileTypeList
        .filter(e => e.name == type)
        .map(e => e.icon)[0];
};
}
