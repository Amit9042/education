import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { AuthGuard, RoleGuard } from '@sharedModule/guards';
import { CustomPreloadingStrategy } from '@sharedModule/routing';
import { ComingSoonComponent } from './components';

const routes: Routes = [
    {
        path: '',
        redirectTo: RouteConstant.HOME,
        pathMatch: 'full'
    },
    {
        path: RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/dashboard-module/provider-dashboard.module'
            ).then((m) => m.ProviderDashboardModule),
        data: { preload: true },
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/dashboard-module/student-dashboard.module'
            ).then((m) => m.StudentDashboardModule),
        data: { preload: true },
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.PROVIDER_STUDENT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/student-module/student.module'
            ).then((m) => m.StudentModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.CLASSES_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/classes-module/classes.module'
            ).then((m) => m.ClassesModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.ENROLLMENT_REQUEST_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/enrollment-request-module/enrolment-request.module'
            ).then((m) => m.EnrolmentRequestModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.GO_LIVE_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/go-live-module/go-live.module'
            ).then((m) => m.GoLiveModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.MATERIAL_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/material-module/material.module'
            ).then((m) => m.MaterialModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_JOIN_CLASS_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/join-class-module/join-class.module'
            ).then((m) => m.JoinClassModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-material-module/student-material.module'
            ).then((m) => m.StudentMaterialModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.PROFILE_DETAILS_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/profile-details-module/profile-details.module'
            ).then((m) => m.ProfileDetailsModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-profile-module/student-profile.module'
            ).then((m) => m.StudentProfileModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_ENROLLMENT_STATUS_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-enrollment-status-module/student-enrollment-status.module'
            ).then((m) => m.StudentEnrollmentStatusModule),
        data: { preload: true },
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.ROLE_MANAGEMENT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/role-management-module/role-management.module'
            ).then((m) => m.RoleManagementModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.USER_MANAGEMENT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/user-management-module/user-management.module'
            ).then((m) => m.UserManagementModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.RECORDED_SESSION_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/recorded-session-module/recorded-session.module'
            ).then((m) => m.RecordedSessionModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.PRACTICE_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-practice-module/student-practice.module'
            ).then((m) => m.StudentPracticeModule)
    },
    {
        path: RouteConstant.STUDENT_DOUBT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-doubts-module/student-doubts.module'
            ).then((m) => m.StudentDoubtsModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.PROVIDER_DOUBT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/provider-doubt-module/provider-doubt.module'
            ).then((m) => m.ProviderDoubtModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.ASSIGNMENT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/assignment-module/assignment.module'
            ).then((m) => m.AssignmentModule)
    },
    {
        path: RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-assignment-module/student-assignment.module'
            ).then((m) => m.StudentAssignmentModule)
    },
    {
        path: RouteConstant.STUDENT_RECORDED_SESSION_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-recorded-session-module/student-recorded-session.module'
            ).then((m) => m.StudentRecordedSessionModule),
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.PARENT_CLASSES_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/parent-classes-module/parent-classes.module'
            ).then((m) => m.ParentClassesModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.CLASS_REPORT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/report-module/report.module'
            ).then((m) => m.ReportModule),
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.CHAPTER_MANAGEMENT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/chapter-management-module/chapter-management.module'
            ).then((m) => m.ChapterManagementModule)
    },
    {
        path: RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/question-bank-module/question-bank.module'
            ).then((m) => m.QuestionBankModule),
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-practice-module/student-practice.module'
            ).then((m) => m.StudentPracticeModule),
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.PROVIDER_PRACTICE_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/provider-practice-module/provider-practice.module'
            ).then((m) => m.ProviderPracticeModule),
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.COURSE_PROVIDER_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/provider/course-module/course.module'
            ).then((m) => m.CourseModule),
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.STUDENT_COURSE_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './private-modules/modules/student/student-course-module/student-course.module'
            ).then((m) => m.StudentCourseModule),
    },
    {
        path: RouteConstant.COMING_SOON_ROUTE,
        component: ComingSoonComponent
    },
    {
        path: '**',
        redirectTo: RouteConstant.HOME,
        pathMatch: 'full'
    }
];

export const appRoutingProviders: any[] = [CustomPreloadingStrategy];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: CustomPreloadingStrategy
        })
    ],
    exports: [RouterModule],
    providers: [appRoutingProviders]
})
export class AppRoutingModule {}
