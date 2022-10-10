import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {
    FormBaseComponent,
    ConfirmationMessageDialogComponent
} from '@sharedModule/components';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ValidationConstant } from '@sharedModule/constants';
import { MaterialSubject } from '@sharedModule/models';
import {
    StudentPracticeDetailsModel,
    StudentQuestionModel,
    StudentQuestionsListModel
} from '../../../models';
import { MatRadioChange } from '@angular/material/radio';
import { StudentPracticeService } from '../../../services';
import { MatDialog } from '@angular/material/dialog';

enum QuestionStatus {
    WRONG = 'WRONG',
    SKIP = 'SKIP',
    CORRECT = 'CORRECT',
    PARTIAL_CORRECT = 'PARTIAL_CORRECT'
}

@Component({
    selector: 'es-user-question-list-left',
    templateUrl: './question-list-left.component.html',
    styleUrls: ['./question-list-left.component.scss']
})
export class QuestionListLeftComponent extends FormBaseComponent
    implements OnInit, OnChanges {
    // Angular variables
    @Input() formGroup;
    @Input() formGroupArray;
    @Input() subject: MaterialSubject;
    @Input() practiceDetails: StudentPracticeDetailsModel;
    @Input() studentQuestionList: StudentQuestionsListModel[] = [];
    @Input() questionDetail: StudentQuestionModel;
    @Output() selectQuestion = new EventEmitter();
    @Output() onBackConfirm = new EventEmitter();

    // Constant variables
    questionStatus = QuestionStatus;
    validationMsg = new ValidationConstant();

    // Data variables
    mostActiveSequenceId: number;

    // Form variables
    questionStatusArray: string[] = [];

    // state variables
    isWrong = false;
    isCorrect = false;
    isSkipped = false;
    isPartialAnswered = false;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        public location: Location,
        private _studentPracticeService: StudentPracticeService
    ) {
        super(fb);
    }

    ngOnInit(): void {}

    ngOnChanges() {
        let record = this.studentQuestionList.find((record) => !record.status);
        this.mostActiveSequenceId = record ? record.questionSequence : null;
    }

    // Page events
    onClickPreviousQuestion = (question: StudentQuestionsListModel) => {
        if (
            this.mostActiveSequenceId &&
            question.questionSequence <= this.mostActiveSequenceId &&
            this.questionDetail.questionId !== question.questionId
        ) {
            if (question.questionSequence < this.mostActiveSequenceId) {
                this.selectQuestion.emit(question);
            }
            if (question.questionSequence === this.mostActiveSequenceId) {
                this.selectQuestion.emit();
            }
        } else if (this._studentPracticeService.getIsPracitceDetailView()) {
            this.selectQuestion.emit(question);
        }
    };

    onChangeStatus = (event: MatRadioChange) => {
        this.questionStatusArray = [];
        if (event.value) {
            this.questionStatusArray.push(event.value);
        }
    };

    showQuestionBasedOnStatus = () => {
        this.isWrong = this.questionStatusArray.includes(
            this.questionStatus.WRONG
        );
        this.isCorrect = this.questionStatusArray.includes(
            this.questionStatus.CORRECT
        );
        this.isSkipped = this.questionStatusArray.includes(
            this.questionStatus.SKIP
        );
        this.isPartialAnswered = this.questionStatusArray.includes(
            this.questionStatus.PARTIAL_CORRECT
        );
    };

    onScroll = () => {};

    onBack = () => {
        const isView = this._studentPracticeService.getIsPracitceDetailView();
        if (!isView) {
            const dialogRef = this.dialog.open(
                ConfirmationMessageDialogComponent,
                {
                    data: {
                        title: 'Confirmation',
                        caption:
                            'Are you sure you want to pause the practice ?',
                        primaryButtonLabel: 'Yes',
                        secondaryButtonLabel: 'No'
                    }
                }
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.onBackConfirm.emit(true);
                }
            });
        } else {
            this.location.back();
        }
    };

    // Helpers
    get formControls() {
        return this.formGroup.controls;
    }

    isIncludedStatus = (status: QuestionStatus) => {
        return this.questionStatusArray.includes(status);
    };
}
