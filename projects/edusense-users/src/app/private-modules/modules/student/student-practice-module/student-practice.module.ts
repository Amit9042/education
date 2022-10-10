import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPracticeRoutingModule } from './student-practice-routing.module';
import { SharedModule } from '@sharedModule/shared.module';
import {
    ChooseSubjectPracticeComponent,
    PracticeListComponent,
    QuestionDetailsRightComponent,
    QuestionListLeftComponent,
    StudentBookmarkQuestionComponent,
    StudentPracticeDetailsContainerComponent
} from './components';
import { PracticeResultDialogComponent } from './components/practice-result-dialog/practice-result-dialog.component';
import { PracticeChapterComponent } from './components/practice-chapter/practice-chapter.component';

@NgModule({
    declarations: [
        ChooseSubjectPracticeComponent,
        PracticeListComponent,
        StudentPracticeDetailsContainerComponent,
        QuestionListLeftComponent,
        QuestionDetailsRightComponent,
        StudentBookmarkQuestionComponent,
        PracticeResultDialogComponent,
        PracticeChapterComponent
    ],
    imports: [CommonModule, SharedModule, StudentPracticeRoutingModule],
    entryComponents: [PracticeResultDialogComponent]
})
export class StudentPracticeModule {}
