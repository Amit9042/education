import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'es-user-question-select-container',
    templateUrl: './question-select-container.component.html',
    styleUrls: ['./question-select-container.component.scss']
})
export class QuestionSelectContainerComponent implements OnInit {
    totalQuestions;
    selectedQues;
    constructor() {}

    ngOnInit(): void {}

    getQuesLength(quesLength) {
        this.totalQuestions = quesLength;
    }

    selectedQuestionId(id) {
        this.selectedQues = id;
    }
}
