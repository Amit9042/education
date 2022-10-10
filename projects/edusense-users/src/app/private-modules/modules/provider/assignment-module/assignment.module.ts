import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import {
    AssignmentCheckDialogComponent,
    AssignmentListComponent,
    AssignmentSubmissionListViewComponent,
    AssignmentSubmissionViewComponent,
    AssignmentViewComponent
} from './components';
import { CreateAssignmentDialogComponent } from './components/create-assignment-dialog/create-assignment-dialog.component';
import { SharedModule } from '@sharedModule/shared.module';
import { UtilityLibModule } from 'utility-lib';

@NgModule({
    declarations: [
        AssignmentListComponent,
        CreateAssignmentDialogComponent,
        AssignmentViewComponent,
        AssignmentSubmissionViewComponent,
        AssignmentSubmissionListViewComponent,
        AssignmentCheckDialogComponent
    ],
    imports: [
        CommonModule,
        UtilityLibModule,
        SharedModule,
        AssignmentRoutingModule
    ]
})
export class AssignmentModule {}
