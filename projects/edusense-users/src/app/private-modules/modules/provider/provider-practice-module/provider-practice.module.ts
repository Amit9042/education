import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderPracticeRoutingModule } from './provider-practice-routing.module';
import {
    ChooseGradePracticeComponent,
    ChooseSubjectPracticeComponent,
    PracticeListComponent,
    PracticeDetailsDialogComponent,
    SelectQuestionBankPracticeDialogComponent,
    QuestionSelectContainerComponent,
    QuestionListLeftComponent,
    QuestionDetailsRightComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
    declarations: [
        ChooseGradePracticeComponent,
        ChooseSubjectPracticeComponent,
        PracticeListComponent,
        PracticeDetailsDialogComponent,
        SelectQuestionBankPracticeDialogComponent,
        QuestionSelectContainerComponent,
        QuestionListLeftComponent,
        QuestionDetailsRightComponent,
    ],
    imports: [CommonModule, SharedModule, ProviderPracticeRoutingModule],
    entryComponents: [
        PracticeDetailsDialogComponent,
        SelectQuestionBankPracticeDialogComponent
    ]
})
export class ProviderPracticeModule {}
