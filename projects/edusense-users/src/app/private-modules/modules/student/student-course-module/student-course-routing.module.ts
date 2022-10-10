import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { StudentCourseContainerComponent, StudentCourseDetailsContainerComponent, EnrollCourseComponent } from './components';

const routes: Routes = [
    {
        path: '',
        component: StudentCourseContainerComponent
    },
    {
        path: RouteConstant.STUDENT_COURSE_CONTAINER_ROUTE,
        component: StudentCourseContainerComponent
    },
    {
        path: RouteConstant.STUDENT_COURSE_DETAILS_CONTAINER_ROUTE + '/:courseId/:enrollmentId',
        component: StudentCourseDetailsContainerComponent
    },
    {
        path: RouteConstant.ENROLL_COURSE_CONTAINER_ROUTE + '/:courseId',
        component: EnrollCourseComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentCourseRoutingModule { }
