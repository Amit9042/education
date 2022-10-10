import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sharedModule/shared.module';

import { StudentAssignmentRoutingModule } from './student-assignment-routing.module';
import { UtilityLibModule } from 'utility-lib';
import {
    StudentAssignmentListComponent,
    AssignmentSubmissionDialogComponent,
    AssignmentCompletedViewComponent,
    AssignmentSubmittedWorkViewComponent,
    StudentAssignmentViewComponent
} from './components';

@NgModule({
    declarations: [
        StudentAssignmentListComponent,
        AssignmentSubmissionDialogComponent,
        AssignmentCompletedViewComponent,
        AssignmentSubmittedWorkViewComponent,
        StudentAssignmentViewComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        UtilityLibModule,
        StudentAssignmentRoutingModule
    ]
})
export class StudentAssignmentModule {}
