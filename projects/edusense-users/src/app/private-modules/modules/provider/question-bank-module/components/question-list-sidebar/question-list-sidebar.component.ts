import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationMessageDialogComponent } from '@sharedModule/components';
import {
    RouteConstant,
    PAGE_SIZE_OPTIONS,
    OperatorEnum,
    DifficultyLevelList,
    QuestionTypeList
} from '@sharedModule/constants';
import { Router } from '@angular/router';
import { QuestionBankService } from '../../service';
import { FormControl } from '@angular/forms';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-question-list-sidebar',
    templateUrl: './question-list-sidebar.component.html',
    styleUrls: ['./question-list-sidebar.component.scss']
})
export class QuestionListSidebarComponent implements OnInit {
    @Output() totalQuestions = new EventEmitter<any>();
    @Output() selectedQuestionDetail = new EventEmitter<any>();
    @Input() isQuesDelete;
    @Input() isPreviousClick;
    @Input() isQuestionSave;
    @Input() isSaveAddNew;

    difficultyLevelList = DifficultyLevelList;
    questionTypeList = QuestionTypeList;

    // Form variables
    searchTitle: FormControl = new FormControl('');

    // static variable
    isQuesClicked = false;
    ifFilterSelected = true;
    ifGridSelected = false;

    // Data related variables
    questionList: any[] = [];
    criteriaArray = [];
    filterDifficulty = [];
    filterQueType = [];
    selectedQuestion = null;
    selectedGradeAndSubject;
    currentSelectedQuestionDetail;
    userConfigDetails;

    // State variables
    criteria = {};
    isLoadingResults = false;

    // Pagination variables
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    totalElements = 0;
    totalPages = 0;
    rowNumber = 1;

    constructor(
        public dialog: MatDialog,
        private _router: Router,
        private questionBankService: QuestionBankService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.selectedGradeAndSubject = this.questionBankService.getQuestionBankFilterData();
        this.userConfigDetails = this.sharedService.getUserConfig();
        this.getQuestionList('filter');
        this.searchTitleValueChanges();
    }

    ngOnChanges() {
        if (this.isQuesDelete) {
            this.currentSelectedQuestionDetail = this.isQuesDelete;
            this.rowNumber = 1;
            this.getQuestionList('delete');
        }
        if (this.isPreviousClick) {
            if (this.isPreviousClick['number'] > 0) {
                let prevQues = this.questionList[
                    this.isPreviousClick.number - 2
                ];
                this.onQuestionClick(
                    prevQues,
                    this.isPreviousClick.number - 1,
                    this.questionList[this.isPreviousClick.number - 3]
                        ? this.isPreviousClick.number - 3
                        : -1
                );
            }
        }
        if (this.isQuestionSave) {
            this.questionList.forEach((element) => {
                if (element.questionId === this.isSaveAddNew.questionId) {
                    element.question = this.isSaveAddNew.question;
                }
            });
            this.selectedQuestion = null;
        }
        if (this.isSaveAddNew) {
            this.rowNumber = this.questionList.length + 1;
            this.getQuestionList('saveNew');
            this.selectedQuestion = null;
        }
    }

    searchTitleValueChanges = () => {
        this.searchTitle.valueChanges.subscribe((val) => {
            this.getQuestionList('filter');
        });
    };

    getQuestionList = (flag) => {
        this.isLoadingResults = true;
        this.questionBankService
            .getQuizQuestionList(this.queryParams())
            .subscribe((response) => {
                this.handleQuizChaperListResponse(response, flag);
            });
    };

    handleQuizChaperListResponse = (response, flag) => {
        this.isLoadingResults = false;
        const questionDataList = response.payload.content;
        this.totalElements = response.payload.pageable.totalElements;
        if (questionDataList.length) {
            if (flag === 'filter') {
                this.questionList = questionDataList;
                this.onQuestionClick(this.questionList[0], 1, -1);
                this.totalQuestions.emit(this.totalElements);
            } else if (flag === 'delete') {
                this.questionList = questionDataList;
                if (
                    this.currentSelectedQuestionDetail['number'] >
                    this.questionList.length
                ) {
                    let question = this.questionList[
                        this.questionList.length - 1
                    ];
                    this.onQuestionClick(
                        question,
                        this.questionList.length,
                        this.questionList[this.questionList.length - 2]
                            ? this.questionList.length - 2
                            : -1
                    );
                } else {
                    let question = this.questionList[
                        this.currentSelectedQuestionDetail['number'] - 1
                    ];
                    this.onQuestionClick(
                        question,
                        this.currentSelectedQuestionDetail['number'],
                        this.questionList[
                            this.currentSelectedQuestionDetail['number'] - 2
                        ]
                            ? this.currentSelectedQuestionDetail['number'] - 2
                            : -1
                    );
                }
            } else if (flag === 'scroll') {
                this.questionList = this.questionList.concat(questionDataList);
                this.totalQuestions.emit(this.totalElements);
            } else if (flag === 'saveNew') {
                this.questionList = this.questionList.concat(questionDataList);
                this.totalQuestions.emit(this.totalElements + 1);
            }
        } else {
            this.questionList = questionDataList;
            this.totalQuestions.emit(1);
            this.currentSelectedQuestionDetail = {
                prevQuestionId: -1,
                questionId: 0,
                number: 1
            };
            this.selectedQuestionDetail.emit(
                this.currentSelectedQuestionDetail
            );
        }
    };

    onBackToList = () => {
        delete this.selectedGradeAndSubject['folderId'];
        delete this.selectedGradeAndSubject['folder'];
        this.questionBankService.setQuestionBankFilterData(
            this.selectedGradeAndSubject
        );
        this._router.navigate(['/' + RouteConstant.QUE_BANK_CHAPTER_LIST]);
    };

    onQuestionClick = (ques, number, prevQues) => {
        this.selectedQuestion = ques;
        this.currentSelectedQuestionDetail = {
            questionId: this.selectedQuestion.questionId,
            number: number,
            prevQuestionId: prevQues !== -1 ? this.questionList[prevQues] : -1
        };
        this.selectedQuestionDetail.emit(this.currentSelectedQuestionDetail);
        this.totalQuestions.emit(this.totalElements);
    };

    onSelectMenuDifficulty(event, value) {
        if (event.checked) {
            this.filterDifficulty.push(value);
        } else {
            this.filterDifficulty = this.filterDifficulty.filter((val) => {
                return val !== value;
            });
        }
        this.getQuestionList('filter');
    }

    onSelectMenuQueType(event, value) {
        if (event.checked) {
            this.filterQueType.push(value);
        } else {
            this.filterQueType = this.filterQueType.filter((val) => {
                return val !== value;
            });
        }
        this.getQuestionList('filter');
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

    onDeleteQuestion = (ques) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            data: {
                title: 'Confirmation',
                caption: 'Are you sure want to Remove Question?',
                primaryButtonLabel: 'Remove Question',
                secondaryButtonLabel: 'Cancel',
                question: ques
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.questionBankService
                    .removeQuestion(ques.questionId)
                    .subscribe((response) => {
                        this.rowNumber = 1;
                        this.getQuestionList('delete');
                    });
            }
        });
    };

    onGridSelection = () => {
        this.ifGridSelected = !this.ifGridSelected;
        this.ifFilterSelected = !this.ifFilterSelected;
    };

    // Helper methods
    queryParams = (): any => {
        this.criteriaArray = [
            {
                column: 'deleted',
                operator: OperatorEnum.FALSE
            },
            {
                column: 'folderId',
                operator: OperatorEnum.CONTAIN,
                values: [this.selectedGradeAndSubject['folderId']]
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
            offset: this.rowNumber,
            limit: this.recordsPerPage,

            sort: {
                column: 'questionId',
                sortType: 'asc'
            },
            criteria: this.criteriaArray
        };
    };

    onScroll = () => {
        const newRowNumber = this.rowNumber + this.recordsPerPage;
        if (newRowNumber <= this.totalElements) {
            this.rowNumber = newRowNumber;
            this.getQuestionList('scroll');
        }
    };

    showMoreOptions = () => {
        return (
            this.userConfigDetails.user_id ===
            this.selectedGradeAndSubject.createdBy
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
