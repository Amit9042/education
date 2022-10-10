import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MaterialImportsModule } from './material-imports';
import { DateAdapter } from '@angular/material/core';
import { FormBaseComponent } from './shared-components/form-base/form-base.component';
import { SelectSearchComponent } from './shared-components/ss-select-search/ss-select-search.component';
import { CheckEmptyPipe, PlaceNAPipe } from './pipes/checkEmpty.pipe';
import { ClickOutsideDirective } from './directives/outside-click.directive';
import { ConfirmationMessageDialogComponent } from './shared-components/dialogs';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './shared-components/pagination/pagination.component';
import { SharedService } from './services';
import { SideDoubtListComponent } from './shared-components/side-doubt-list/side-doubt-list.component';
import { DoubtListComponent } from './shared-components/doubt-list/doubt-list.component';
import { QuestionAnswerComponent } from './shared-components/question-answer/question-answer.component';
import { StudentQuestionViewComponent } from './shared-components/student-question-view/student-question-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    FormBaseComponent,
    SelectSearchComponent,
    CheckEmptyPipe,
    PlaceNAPipe,
    ClickOutsideDirective,
    ConfirmationMessageDialogComponent,
    DoubtListComponent,
    SideDoubtListComponent,
    PaginationComponent,
    QuestionAnswerComponent,
    StudentQuestionViewComponent
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    MaterialImportsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormBaseComponent,
    MaterialImportsModule,
    FormsModule,
    ReactiveFormsModule,
    SelectSearchComponent,
    CheckEmptyPipe,
    ClickOutsideDirective,
    ConfirmationMessageDialogComponent,
    SideDoubtListComponent,
    DoubtListComponent,
    PdfViewerModule,
    PaginationComponent,
    QuestionAnswerComponent,
    StudentQuestionViewComponent
  ]
})
export class UtilityLibModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UtilityLibModule,
      providers: [SharedService]
    };
  }
}
