import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sharedModule/shared.module';
import { QuestionBankRoutingModule } from './question-bank-routing.module';
import {
    QueBankGradeComponent,
    QueBankChapterListComponent,
    QueBankSubjectComponent,
    AddChapterDialogComponent,
    QuestionBankQueListComponent,
    QuestionListSidebarComponent,
    QuestionFormComponent,
    QuestionPreviewComponent,
    QuestionPreviewLeftComponent,
    QuestionPreviewRightComponent
} from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
    declarations: [
        QueBankGradeComponent,
        QueBankSubjectComponent,
        QueBankChapterListComponent,
        AddChapterDialogComponent,
        QuestionBankQueListComponent,
        QuestionListSidebarComponent,
        QuestionFormComponent,
        QuestionPreviewComponent,
        QuestionPreviewLeftComponent,
        QuestionPreviewRightComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        QuestionBankRoutingModule,
        InfiniteScrollModule,
        LMarkdownEditorModule
    ],
    exports: []
})
export class QuestionBankModule {}
