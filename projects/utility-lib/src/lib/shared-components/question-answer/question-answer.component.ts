import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SharedService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationMessageDialogComponent } from '../dialogs';
import { trunkTrailString_1 } from '../../functions';

@Component({
    selector: 'lib-question-answer',
    templateUrl: './question-answer.component.html',
    styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnInit, OnChanges {

    @Input() questionData;
    @Output() answerDelete = new EventEmitter<any>();
    @Output() questionDelete = new EventEmitter<any>();
    @Output() answerEdit = new EventEmitter<any>();
    @Output() questionEdit = new EventEmitter<any>();

    answerList = [];
    copyOfAnswerList = [];
    isShowMore = false;
    userId: number;
    answerTxt: string = 'Answer';

    descriptionMinimumLength = 180;
    isMoreDescription = false;

    constructor(private sharedService: SharedService,
        public dialog: MatDialog) {}

    ngOnInit(): void {
        const config = this.sharedService.getUserConfig();
        this.userId = config.user_id;
    }

    ngOnChanges() {
        if (this.questionData && this.questionData.comments) {
            this.copyOfAnswerList = this.questionData.comments;
            this.answerTxt = this.copyOfAnswerList.length && this.copyOfAnswerList.length == 1 ? 'Answer' : 'Answers';
            if (this.copyOfAnswerList.length > 5) {
                this.isShowMore = true;
                this.answerList = [];
                for (let i = 0; i < 5; i++) {
                    this.answerList[i] = this.copyOfAnswerList[i];
                }
                this.setDescription();
            } else {
                this.answerList = this.copyOfAnswerList;
                this.setDescription();
            }
        }
    }
    
    setDescription = () => {
        this.answerList.forEach(elem => {
            if (elem.description.length > this.descriptionMinimumLength) {
                // elem['copyOfDescription'] = elem['description']
                elem['copyOfDescription'] = this.trunkTrailString(elem.description, this.isMoreDescription);
                elem['isMoreDesc'] = true;
            } else {
                if (elem.description.length && elem.images !== null) {
                    if (elem.images.length) {
                        elem['isMoreDesc'] = true;
                    }
                } else {
                    elem['isMoreDesc'] = false;
                }
            }
        });
    }

    onDeleteQuestion = (questionData) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            data: {
                title: 'Confirmation',
                caption: 'Are you sure want to delete this question?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });
    
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.questionDelete.emit(questionData);
            }
        });
    }

    onDeleteAnswer = (answerData) => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            data: {
                title: 'Confirmation',
                caption: 'Are you sure want to delete this answer?',
                primaryButtonLabel: 'Delete',
                secondaryButtonLabel: 'Cancel'
            }
        });
    
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.answerDelete.emit(answerData);
            }
        });
    }

    onEditAnswer = (answerData) => {
        this.answerEdit.emit(answerData);
    }

    onEditQuestion = (questionData) => {
        this.questionEdit.emit(questionData);
    }

    onShowMore = () => {
        this.isShowMore = false;
        this.answerList = this.copyOfAnswerList;
    };

    onSeeMoreDesc = (comment) => {
        const index = this.answerList.findIndex(elem => elem._id === comment._id);
        this.answerList[index].isMoreDesc = !this.answerList[index].isMoreDesc;
    }
    
    trunkTrailString(description, flag) {
        return trunkTrailString_1(description, this.descriptionMinimumLength, flag);
    }
}
