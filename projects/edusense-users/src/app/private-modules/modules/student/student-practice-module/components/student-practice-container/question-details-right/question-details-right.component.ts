import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionType, ValidationConstant } from '@sharedModule/constants';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import {
    StudentPracticeDetailsModel,
    StudentQuestionModel
} from '../../../models';
import { checkEmptyValue } from '@sharedModule/functions';
import * as marked from 'marked';
import { StudentPracticeService } from '../../../services';
import { EnterpriseDetail } from '../../../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-question-details-right',
    templateUrl: './question-details-right.component.html',
    styleUrls: ['./question-details-right.component.scss']
})
export class QuestionDetailsRightComponent
    extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @Input() practiceDetails: StudentPracticeDetailsModel;
    @Input() totalQuestions;
    @Input() selectedQuestionNumber;
    @Input() questionDetail: StudentQuestionModel;
    @Input() answerSubmitted;
    @Input() showResult;
    @Output() submitEvent = new EventEmitter<any>();
    @Output() previousEvent = new EventEmitter<boolean>();
    @Output() nextEvent = new EventEmitter<boolean>();
    @Output() viewResultEvent = new EventEmitter<boolean>();

    // Constant variables
    validationMsg = new ValidationConstant();
    questionType = QuestionType;

    singleAnswer: FormControl = new FormControl('');

    //Data Variables
    selectedAnswer = [];
    clockDisplay: string;
    activeEnterprise: EnterpriseDetail;

    // State variables
    isViewSolution = false;
    isBookMarked = false;
    quizTimer;
    isViewPractice = false;

    constructor(
        fb: FormBuilder,
        private studentPracticeService: StudentPracticeService,
        private sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.isViewPractice = this.studentPracticeService.getIsPracitceDetailView();
        this.onRadioAnswerValueChanges();
        if (this.practiceDetails && this.practiceDetails.startTime) {
            this.getQuizTime(this.practiceDetails.totalTime);
        }
    }

    ngOnChanges() {
        this.isBookMarked =
            this.questionDetail && this.questionDetail.questionBookmarked
                ? this.questionDetail.questionBookmarked
                : false;
        this.selectedAnswer =
            this.questionDetail && this.questionDetail.selectedAnswerIds
                ? this.questionDetail.selectedAnswerIds
                : [];
    }

    ngOnDestroy() {
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
    }

    convertMarkDownToHtml = (value) => {
        if (!checkEmptyValue(value)) {
            return marked(value.replace(/[\n\r]/g, '<br/>'));
        }
    };

    onRadioAnswerValueChanges = () => {
        this.singleAnswer.valueChanges.subscribe((value) => {
            this.selectedAnswer = [value];
        });
    };

    // API calls
    bookmarkedQuestionApiCall = (status: boolean, questionId: number) => {
        return this.studentPracticeService.bookmarkedQuestion(
            this.practiceDetails.practiseId,
            status,
            questionId,
            {
                providerUUID: this.activeEnterprise.provider_uuid
            }
        );
    };

    onAnswerChange = (event, option) => {
        if (event.checked) {
            this.selectedAnswer.push(option.answerId);
        } else {
            this.selectedAnswer = this.selectedAnswer.filter(
                (item) => item !== option.answerId
            );
        }
    };

    isCheckedAnswer = (answerId) => {
        return (
            this.questionDetail.currectAnswerIds.includes(answerId) ||
            this.selectedAnswer.includes(answerId)
        );
    };

    isCorrectAnswer = (answerId) => {
        return this.questionDetail.currectAnswerIds.includes(answerId);
    };

    onSubmitEmitFn = (isSkip) => {
        let answerDetail = {
            questionId: this.questionDetail.questionId,
            answerIds: this.selectedAnswer,
            skip: isSkip
        };
        this.submitEvent.emit(answerDetail);
    };

    onNextClick = () => {
        this.singleAnswer.setValue('');
        this.selectedAnswer = [];
        this.nextEvent.emit(true);
    };

    onPreviousClick = () => {
        this.previousEvent.emit(true);
    };

    viewResult = () => {
        this.viewResultEvent.emit(true);
    };

    onViewSolution = () => {
        this.isViewSolution = true;
    };

    onBookMarkToggle = (status: boolean, id: number) => {
        this.bookmarkedQuestionApiCall(!status, id).subscribe((response) => {
            this.isBookMarked = !this.isBookMarked;
        });
    };

    // Helpers
    getQuizTime = (startTime) => {
        let minutes: any;
        let seconds: any;
        const self = this;
        this.quizTimer = setInterval(function () {
            if (!self.showResult) {
                ++startTime;
                minutes = Math.floor(startTime / 60);
                seconds = Math.floor(startTime % 60);
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                self.clockDisplay = minutes + ':' + seconds;
            }
        }, 1000);
    };
}
