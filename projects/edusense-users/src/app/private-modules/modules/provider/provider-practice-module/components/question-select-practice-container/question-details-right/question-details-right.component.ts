import { Component, OnInit, Input } from '@angular/core';
import {
    DifficultyLevelList,
    QuestionType,
    QuestionTypeList
} from '@sharedModule/constants';
import { PracticeService } from '../../../service';
import * as marked from 'marked';
import { checkEmptyValue } from '@sharedModule/functions';
import { ProviderQuestionModel } from '../../../models';

@Component({
    selector: 'es-user-question-details-right',
    templateUrl: './question-details-right.component.html',
    styleUrls: ['./question-details-right.component.scss']
})
export class QuestionDetailsRightComponent implements OnInit {
    // Angular variables
    @Input() totalQuestions;
    @Input() selectedQues;

    // constant variables
    questionType = QuestionType;
    difficultyLevelList = DifficultyLevelList;
    questionTypeList = QuestionTypeList;

    //Data variable
    questionDetail: ProviderQuestionModel;
    selectedGradeAndSubject;

    // Static Variables
    isLoadingResult = false;

    constructor(private practiceService: PracticeService) {}

    ngOnInit(): void {
        this.initalize();
    }

    ngOnChanges() {
        if (this.selectedQues && this.selectedQues.questionId) {
            this.initalize();
            this.getQuestionDetail(this.selectedQues.questionId);
        }
    }

    initalize = () => {
        this.selectedGradeAndSubject = this.practiceService.getPracticeFilterData();
    };

    getQuestionDetail = (questionId) => {
        this.isLoadingResult = true;
        this.questionDetail = null;
        this.practiceService
            .getQuestionDetail(questionId)
            .subscribe((response) => {
                this.handelQuestionDetailResponse(response);
            });
    };

    handelQuestionDetailResponse = (response) => {
        this.isLoadingResult = false;
        this.questionDetail = response.payload;
        if (this.questionDetail.questionImage.length) {
            this.questionDetail.questionImage.forEach((element) => {
                this.questionDetail.question = this.questionDetail.question.replace(
                    `{{img__${element.id}}}`,
                    `![img__${element.id}](${element.url})`
                );
            });
        }
        if (this.questionDetail.solutionImage.length) {
            this.questionDetail.solutionImage.forEach((element) => {
                this.questionDetail.solution = this.questionDetail.solution.replace(
                    `{{img__${element.id}}}`,
                    `![img__${element.id}](${element.url})`
                );
            });
        }
        this.questionDetail.questionAnswer.forEach((element) => {
            element.attachmentIds = element.images;
            if (element.attachmentIds.length) {
                element.attachmentIds.forEach((attachment) => {
                    element.content = element.content.replace(
                        `{{img__${attachment.id}}}`,
                        `![img__${attachment.id}](${attachment.url})`
                    );
                });
            }
        });
    };

    getQuestionTypeNameById = (typeId) => {
        let name = '';
        this.questionTypeList.forEach((element) => {
            if (element.id === typeId) {
                name = element.value;
            }
        });
        return name;
    };

    convertMarkDownToHtml = (value) => {
        if (!checkEmptyValue(value)) {
            return marked(value.replace(/[\n\r]/g, '<br/>'));
        }
    };

    isOptionRight = (option, isCheckbox = false) => {
        if (isCheckbox) {
            if (option.correct === false) {
                return '';
            } else {
                return true;
            }
        } else if (checkEmptyValue(option.correct)) {
            return false;
        } else {
            return true;
        }
    };

    getNoDataFound = () => {
        return checkEmptyValue(this.questionDetail) && !this.isLoadingResult;
    };
}
