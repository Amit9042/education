import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentPracticeReportListComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        component: StudentPracticeReportListComponent,
    },
    {
        path: RouteConstant.STUDENT_PRACTICE_REPORT_LIST_ROUTE,
        component: StudentPracticeReportListComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentPracticeReportRoutingModule {}
