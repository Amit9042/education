import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@sharedModule/shared.module';
import { CourseRoutingModule } from './course-routing.module';
import {
    AdditionalInfoCourseComponent,
    ContentCourseComponent,
    CourseListComponent,
    CourseTitleFormComponent,
    CreateCourseContainerComponent,
    EnrollmentCourseComponent,
    EnrollmentStudentDetailsComponent,
    OverviewCourseComponent,
    PreviewCourseComponent
} from './components';

@NgModule({
    declarations: [
        CourseListComponent,
        OverviewCourseComponent,
        ContentCourseComponent,
        AdditionalInfoCourseComponent,
        PreviewCourseComponent,
        EnrollmentCourseComponent,
        CourseTitleFormComponent,
        CreateCourseContainerComponent,
        EnrollmentStudentDetailsComponent
    ],
    imports: [CommonModule, SharedModule, CourseRoutingModule]
})

export class CourseModule {}
