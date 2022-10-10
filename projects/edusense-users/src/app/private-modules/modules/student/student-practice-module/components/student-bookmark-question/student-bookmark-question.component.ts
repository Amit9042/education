import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
    StudentBookmarkedPracticeModel,
    StudentQuestionModel
} from '../../models';
import { StudentPracticeService } from '../../services';
import { checkEmptyValue } from '@sharedModule/functions';
import * as marked from 'marked';
import { QuestionType } from '@sharedModule/constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedService } from '@sharedModule/services';
import { EnterpriseDetail } from '../../../../../../public-modules/models';

@Component({
    selector: 'es-user-student-bookmark-question',
    templateUrl: './student-bookmark-question.component.html',
    styleUrls: ['./student-bookmark-question.component.scss']
})
export class StudentBookmarkQuestionComponent implements OnInit {
    // Data variables
    bookmarkedPracticeList: StudentBookmarkedPracticeModel[] = [];
    selectedPractices: StudentBookmarkedPracticeModel[] = [];
    questionList: StudentQuestionModel[] = [];
    questionType = QuestionType;

    // State variables
    isBookMarked = true;
    activeEnterprise: EnterpriseDetail;

    constructor(
        public location: Location,
        private activeRoute: ActivatedRoute,
        private studentPracticeService: StudentPracticeService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.routeSubscriber();
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.bookmarkedPracticeList) {
                this.bookmarkedPracticeList =
                    resolvedData.bookmarkedPracticeList;
                if (this.bookmarkedPracticeList.length > 0) {
                    this.selectedPractices.push(this.bookmarkedPracticeList[0]);
                    this.getBookmarkedInformationBasedOnPractice(
                        this.bookmarkedPracticeList[0].id
                    );
                }
            }
        });
    };

    getBookmarkedInformationBasedOnPractice = (practiceId: number) => {
        this.getQuestionsBasedOnPractices(practiceId).subscribe((response) => {
            let array = response['payload'];
            array.forEach((record) => {
                record['practiceId'] = practiceId;
                return this.updateQuestion(record);
            });
            this.questionList = this.questionList.concat(array);
        });
    };

    updateQuestion = (response) => {
        let question = response;
        if (question.questionImage.length) {
            question.questionImage.forEach((element) => {
                question.question = question.question.replace(
                    `{{img__${element.id}}}`,
                    `![img__${element.id}](${element.url})`
                );
            });
        }
        if (question.solutionImage && question.solutionImage.length) {
            question.solutionImage.forEach((element) => {
                question.solution = question.solution.replace(
                    `{{img__${element.id}}}`,
                    `![img__${element.id}](${element.url})`
                );
            });
        }
        question.questionAnswer.forEach((element) => {
            if (element.images.length) {
                element.images.forEach((attachment) => {
                    element.content = element.content.replace(
                        `{{img__${attachment.id}}}`,
                        `![img__${attachment.id}](${attachment.url})`
                    );
                });
            }
        });
        return question;
    };

    // API Calls
    getQuestionsBasedOnPractices = (practiceId: number) => {
        return this.studentPracticeService.getQuestionBasedOnPractice(
            practiceId,
            {
                providerUUID: this.activeEnterprise.provider_uuid
            }
        );
    };

    getBookmarkedPracticeList = () => {
        return this.studentPracticeService.getBookmarkPracticeList({
            providerUUID: this.activeEnterprise.provider_uuid
        });
    };

    bookmarkedQuestionApiCall = (practiceId: number, questionId: number) => {
        return this.studentPracticeService.bookmarkedQuestion(
            practiceId,
            false,
            questionId,
            {
                providerUUID: this.activeEnterprise.provider_uuid
            }
        );
    };

    // Page events
    onCheckedStatusChangePractice = (
        event: MatCheckboxChange,
        practice: StudentBookmarkedPracticeModel
    ) => {
        if (event.checked) {
            this.selectedPractices.push(practice);
            this.getBookmarkedInformationBasedOnPractice(practice.id);
        } else {
            this.questionList = this.questionList.filter(
                (record) => record['practiceId'] !== practice.id
            );
        }
    };

    onBack = () => {
        this.location.back();
    };

    onUnmarkQuestion = (question: StudentQuestionModel) => {
        this.bookmarkedQuestionApiCall(
            question.practiceId,
            question.questionId
        ).subscribe((response) => {
            let practiceId = question.practiceId;
            let index = this.questionList.findIndex(
                (record) => record.questionId === question.questionId
            );
            this.questionList.splice(index, 1);
            let record = this.questionList.find(
                (record) => record.practiceId === practiceId
            );
            if (!record) {
                let practiceIndex = this.selectedPractices.findIndex(
                    (record) => record.id === practiceId
                );
                this.selectedPractices.splice(practiceIndex, 1);
                this.questionList = [];
                this.getBookmarkedPracticeList().subscribe((response) => {
                    this.bookmarkedPracticeList = response['payload'];
                });
                if (this.selectedPractices.length > 0) {
                    this.selectedPractices.forEach((record) => {
                        this.getBookmarkedInformationBasedOnPractice(record.id);
                    });
                }
            }
        });
    };

    // Helper methods
    getPracticeCheckedStatus = (practice: StudentBookmarkedPracticeModel) => {
        let index = this.selectedPractices.findIndex(
            (record) => record.id === practice.id
        );
        return index !== -1;
    };

    convertMarkDownToHtml = (value) => {
        if (!checkEmptyValue(value)) {
            return marked(value.replace(/[\n\r]/g, '<br/>'));
        }
    };
}
