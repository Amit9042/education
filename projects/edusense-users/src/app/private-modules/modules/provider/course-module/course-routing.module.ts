import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    CourseListComponent,
    CourseTitleFormComponent,
    CreateCourseContainerComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        component: CourseListComponent
    },
    {
        path: RouteConstant.COURSE_LIST_ROUTE,
        component: CourseListComponent
    },
    {
        path: RouteConstant.CREATE_COURSE_ROUTE + '/:id',
        component: CreateCourseContainerComponent
    },
    {
        path: RouteConstant.CREATE_COURSE_TITLE_ROUTE,
        component: CourseTitleFormComponent
    },
    {
        path: RouteConstant.EDIT_COURSE_ROUTE + '/:id',
        component: CreateCourseContainerComponent
    }
    // {
    //     path: RouteConstant.ENROLLMENT_STUDENT_ROUTE + '/:id',
    //     component: EnrollmentStudentDetailsComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CourseRoutingModule {}
