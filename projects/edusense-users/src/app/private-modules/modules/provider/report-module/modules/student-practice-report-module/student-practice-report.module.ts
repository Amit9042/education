import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sharedModule/shared.module';

import { StudentPracticeReportRoutingModule } from './student-practice-report-routing.module';
import {
    StudentPracticeReportListComponent,
    StudentPracticeReportViewDialogComponent
} from './components';

@NgModule({
    declarations: [
        StudentPracticeReportListComponent,
        StudentPracticeReportViewDialogComponent
    ],
    imports: [CommonModule, SharedModule, StudentPracticeReportRoutingModule]
})
export class StudentPracticeReportModule {}
