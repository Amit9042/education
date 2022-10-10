import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityLibModule } from 'utility-lib';
import { StudentDoubtsRoutingModule } from './student-doubts-routing.module';
import {
    StudentDoubtListComponent,
    StudentAllDoubtsComponent,
    StudentAllBookmarkDoubtsComponent,
    AskDoubtSelectSubjectComponent,
    StudentQuePreviewDialogComponent,
    AddQuestionDialogComponent,
    StudentQuestionAnswerComponent
} from './components';
import { SharedModule } from '../../../../shared-module/shared.module';
import { AddAnswerDialogComponent } from './components/add-answer-dialog/add-answer-dialog.component';

@NgModule({
    declarations: [
        StudentDoubtListComponent,
        StudentAllDoubtsComponent,
        StudentAllBookmarkDoubtsComponent,
        AskDoubtSelectSubjectComponent,
        AddQuestionDialogComponent,
        StudentQuestionAnswerComponent,
        StudentQuePreviewDialogComponent,
        AddAnswerDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        UtilityLibModule,
        StudentDoubtsRoutingModule
    ],
    entryComponents: [AddQuestionDialogComponent]
})
export class StudentDoubtsModule {}
