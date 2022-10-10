import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import {
    OperatorEnum,
    QuestionTypeList,
    DifficultyLevelList
} from '@sharedModule/constants';
import { PracticeService } from '../../../service';
import { SharedService } from '@sharedModule/services';
import { merge } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { ProviderQuestionModel } from '../../../models';

@Component({
    selector: 'es-user-question-list-left',
    templateUrl: './question-list-left.component.html',
    styleUrls: ['./question-list-left.component.scss']
})
export class QuestionListLeftComponent implements OnInit {
    @Output() totalQuestions = new EventEmitter<any>();
    @Output() selectedQuesId = new EventEmitter<any>();

    difficultyLevelList = DifficultyLevelList;
    questionTypeList = QuestionTypeList;

    // Form Variable
    searchTitle: FormControl = new FormControl('');
    checkSelectAll: FormControl = new FormControl('');

    // Data related variables
    questionList: ProviderQuestionModel[] = [];
    criteriaArray = [];
    filterFolder = [];
    filterDifficulty = [];
    filterQueType = [];
    selectedQuestion = null;
    selectedGradeAndSubject;
    addedQuestionArray = [];
    selectQuestionArray = [];
    userConfigDetails;

    // State variables
    criteria = {};
    isLoadingResults = false;
    isListView = true;

    constructor(
        public location: Location,
        private practiceService: PracticeService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.intialize();
    }

    intialize = () => {
        this.selectedGradeAndSubject = this.practiceService.getPracticeFilterData();
        this.userConfigDetails = this.sharedService.getUserConfig();
        this.filterFolder = this.selectedGradeAndSubject.practiceDetails.chapterIds;
        this.getAddedQuestionToPractise(
            this.selectedGradeAndSubject.practiceDetails.id
        );
    };

    searchTitleValueChanges = () => {
        merge(this.searchTitle.valueChanges)
            .pipe(startWith({}), debounceTime(300))
            .subscribe((val) => {
                this.getQuestionList();
            });
    };

    getAddedQuestionToPractise = (practiceId) => {
        this.isLoadingResults = true;
        this.practiceService
            .getAddedQuestionToPractise(practiceId)
            .subscribe((response) => {
                this.addedQuestionArray = response.payload;
                this.searchTitleValueChanges();
            });
    };

    getQuestionList = () => {
        this.isLoadingResults = true;
        this.questionList = [];
        this.selectQuestionArray = [];
        this.practiceService
            .getQuizQuestionList(this.queryParams())
            .subscribe((response) => {
                this.handleQuizChaperListResponse(response);
            });
    };

    handleQuizChaperListResponse = (response) => {
        this.isLoadingResults = false;
        this.questionList = response.payload.content;
        if (this.questionList.length) {
            this.questionList.forEach((element) => {
                if (
                    this.addedQuestionArray.find((item) => {
                        return item === element.questionId;
                    })
                ) {
                    element['isChecked'] = true;
                    element['time'] = this.getTimeStamp();
                    this.selectQuestionArray.push(element);
                } else {
                    element['isChecked'] = '';
                }
            });
            if (this.selectQuestionArray.length === this.questionList.length) {
                this.checkSelectAll.setValue(true);
            } else {
                this.checkSelectAll.setValue('');
            }
        }
        this.onQuestionClick(this.questionList[0], 1, -1);
        this.totalQuestions.emit(this.questionList.length);
    };

    onQuestionClick = (ques, number, prevQues) => {
        this.selectedQuestion = ques;
        this.selectedQuesId.emit({
            prevQuestionId: prevQues !== -1 ? this.questionList[prevQues] : -1,
            questionId: this.selectedQuestion
                ? this.selectedQuestion.questionId
                : 0,
            number: number
        });
    };

    searchFolder = (folder) => {
        this.filterFolder = folder;
    };

    filterQuestions(questionList): any[] {
        return questionList.filter((item) =>
            this.filterFolder.includes(item.folderId)
        );
    }

    togglePerOne(question) {
        let allChecked: any = true;
        if (!question.isChecked) {
            question.isChecked = true;
            question.time = this.getTimeStamp();
        } else {
            question.isChecked = '';
        }
        for (let index = 0; index < this.questionList.length; index++) {
            if (!this.questionList[index].isChecked) {
                allChecked = '';
                break;
            }
        }
        this.checkSelectAll.setValue(allChecked);
        if (question.isChecked) {
            this.selectQuestionArray.push(question);
        } else {
            this.selectQuestionArray = this.questionList.filter(
                (item) => item.isChecked
            );
        }
        // this.selectQuestionArray = this.questionList.filter(
        //     (item) => item.isChecked
        // );
        // .map((element) => element.questionId);
    }

    selectAll() {
        if (!this.checkSelectAll.value) {
            this.questionList.forEach((element, index) => {
                element.isChecked = true;
                element.time = this.getTimeStamp() + index;
            });
        } else {
            this.questionList.forEach((element) => {
                element.isChecked = '';
            });
        }
        this.selectQuestionArray = this.questionList.filter(
            (item) => item.isChecked
        );
        // .map((element) => element.questionId);
    }

    onSelectMenuDifficulty(event, value) {
        if (event.checked) {
            this.filterDifficulty.push(value);
        } else {
            this.filterDifficulty = this.filterDifficulty.filter((val) => {
                return val !== value;
            });
        }
        this.getQuestionList();
    }

    onSelectMenuQueType(event, value) {
        if (event.checked) {
            this.filterQueType.push(value);
        } else {
            this.filterQueType = this.filterQueType.filter((val) => {
                return val !== value;
            });
        }
        this.getQuestionList();
    }

    isSelectedQuestion = (ques) => {
        if (
            this.selectedQuestion &&
            this.selectedQuestion.questionId === ques.questionId
        ) {
            return true;
        } else {
            return false;
        }
    };

    addQuestionToPractiseApiCall = (params, practiceId) => {
        return this.practiceService.addQuestionToPractise(params, practiceId);
    };

    deleteQuestionFromPractiseApiCall = (params, practiceId) => {
        return this.practiceService.deleteQuestionFromPractise(
            params,
            practiceId
        );
    };

    addQuestionToPractise = () => {
        const addNewQuestions = this.selectQuestionArray.filter(
            (item) => !this.addedQuestionArray.includes(item.questionId)
        );
        const removeQuestionsArray = this.addedQuestionArray.filter(
            (item) =>
                !this.selectQuestionArray
                    .map((question) => question.questionId)
                    .includes(item)
        );
        if (removeQuestionsArray.length) {
            this.deleteQuestionFromPractiseApiCall(
                removeQuestionsArray,
                this.selectedGradeAndSubject.practiceDetails.id
            ).subscribe((response) => {
                if (!addNewQuestions.length) {
                    this.sharedService.setSnackBar(response.message);
                    this.onBack();
                }
            });
        }
        if (addNewQuestions.length) {
            let params = {};
            addNewQuestions.forEach((item) => {
                params[item.time] = item.questionId;
            });
            this.addQuestionToPractiseApiCall(
                params,
                this.selectedGradeAndSubject.practiceDetails.id
            ).subscribe((response) => {
                this.onBack();
            });
        }
    };

    clearAllQuestions = () => {
        this.questionList.forEach((element) => {
            element.isChecked = '';
        });
        this.selectQuestionArray = this.questionList.filter(
            (item) => item.isChecked
        );
        // .map((element) => element.questionId);
        this.checkSelectAll.setValue('');
    };

    onToggleView = () => {
        this.isListView = !this.isListView;
    };

    onBack = () => {
        this.location.back();
    };

    // Helper methods
    getTimeStamp = () => {
        return new Date().getTime();
    };

    queryParams = (): any => {
        this.criteriaArray = [
            {
                column: 'deleted',
                operator: OperatorEnum.FALSE
            },
            {
                column: 'gradeId',
                operator: OperatorEnum.CONTAIN,
                values: [this.selectedGradeAndSubject.grade_id]
            },
            {
                column: 'subjectId',
                operator: OperatorEnum.CONTAIN,
                values: [this.selectedGradeAndSubject.subject_id]
            },
            {
                column: 'folderId',
                operator: OperatorEnum.CONTAIN,
                values: this.selectedGradeAndSubject.practiceDetails.chapterIds
            }
        ];
        if (this.searchTitle.value) {
            this.criteriaArray.push({
                column: 'question',
                operator: OperatorEnum.CONTAIN,
                values: [this.searchTitle.value]
            });
        }
        if (this.filterDifficulty.length) {
            this.criteriaArray.push({
                column: 'difficulty',
                operator: OperatorEnum.CONTAIN,
                values: this.filterDifficulty
            });
        }
        if (this.filterQueType.length) {
            this.criteriaArray.push({
                column: 'type',
                operator: OperatorEnum.CONTAIN,
                values: this.filterQueType
            });
        }
        return {
            offset: 1,
            limit: 2147483647,
            sort: {
                column: 'questionId',
                sortType: 'asc'
            },
            criteria: this.criteriaArray
        };
    };

    showMoreOptions = () => {
        return (
            this.userConfigDetails.user_id ===
            this.selectedGradeAndSubject.practiceDetails.createdBy
        );
    };

    getQuestionForDisplay = (question: string) => {
        if (question && question.length > 100) {
            return question.substring(0, 100) + ' ...';
        } else {
            return question;
        }
    };
}
