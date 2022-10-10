import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityLibModule } from 'utility-lib';
import { ProviderDoubtRoutingModule } from './provider-doubt-routing.module';
import {
    RecievedDoubtsComponent,
    AllDoubtsComponent,
    QuestionAnswerComponent
} from './components';
import { ProviderAddAnswerDialogComponent } from './components/provider-add-answer-dialog/provider-add-answer-dialog.component';

@NgModule({
    declarations: [
        RecievedDoubtsComponent,
        AllDoubtsComponent,
        QuestionAnswerComponent,
        ProviderAddAnswerDialogComponent
    ],
    imports: [CommonModule, UtilityLibModule, ProviderDoubtRoutingModule],
    providers: []
})
export class ProviderDoubtModule {}
