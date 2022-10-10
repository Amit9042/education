import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@sharedModule/shared.module';
import { UtilityLibModule } from 'utility-lib';
import { StudentCourseRoutingModule } from './student-course-routing.module';
import {
    StudentCourseContainerComponent,
    StudentCourseDetailsContainerComponent,
    EnrollCourseComponent
} from './components';
import {
    StudentCourseListComponent,
    StudentMyCoursesComponent,
    StudentBookMarkedComponent,
    StudentCourseCategoriesComponent,
    StudentCourseFiltersComponent
} from './components/student-course-container';
import {
    StudentCourseAboutDetailsComponent,
    StudentCourseNotesDetailsComponent,
    StudentCourseDiscussionDetailsComponent,
    StudentCourseResourcesDetailsComponent,
    StudentOtherCoursesDetailsComponent,
    StudentBusinessCoursesComponent
} from './components/student-course-details-container';

@NgModule({
    declarations: [
        StudentCourseContainerComponent,
        StudentCourseListComponent,
        StudentMyCoursesComponent,
        StudentBookMarkedComponent,
        StudentCourseCategoriesComponent,
        StudentCourseDetailsContainerComponent,
        StudentCourseAboutDetailsComponent,
        StudentCourseNotesDetailsComponent,
        StudentCourseDiscussionDetailsComponent,
        StudentCourseResourcesDetailsComponent,
        StudentOtherCoursesDetailsComponent,
        StudentBusinessCoursesComponent,
        StudentCourseFiltersComponent,
        EnrollCourseComponent
    ],
    imports: [
        CommonModule,
        UtilityLibModule,
        SharedModule,
        StudentCourseRoutingModule
    ]
})
export class StudentCourseModule {}
