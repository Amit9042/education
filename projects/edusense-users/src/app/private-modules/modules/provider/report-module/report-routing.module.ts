import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        redirectTo: RouteConstant.CLASS_ATTENDANCE_MODULE_ROUTE
    },
    {
        path: RouteConstant.CLASS_ATTENDANCE_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './modules/class-attendance-module/class-attendance.module'
            ).then((m) => m.ClassAttendanceModule)
    },
    {
        path: RouteConstant.STUDENT_PRACTICE_REPORT_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './modules/student-practice-report-module/student-practice-report.module'
            ).then((m) => m.StudentPracticeReportModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule {}
