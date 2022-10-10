import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'es-user-question-bank-que-list',
    templateUrl: './question-bank-que-list.component.html',
    styleUrls: ['./question-bank-que-list.component.scss']
})
export class QuestionBankQueListComponent implements OnInit {
    totalQuestions;
    selectedQues;
    isDelete;
    isPreviousClick;
    isQuestionSave;
    isSaveAddNew;
    constructor() {}

    ngOnInit(): void {}

    getQuesLength(quesLength) {
        this.totalQuestions = quesLength;
    }

    getSelectedQuestionDetail(detail) {
        this.selectedQues = detail;
    }

    isQueDeleted(flag) {
        this.isDelete = flag;
    }

    isPreviousQuesClick(data) {
        this.isPreviousClick = data;
    }

    isSaveQuestion(questionId) {
        this.isQuestionSave = questionId;
    }

    isSaveAddNewQuestion(flag) {
        this.isSaveAddNew = flag;
    }
}
