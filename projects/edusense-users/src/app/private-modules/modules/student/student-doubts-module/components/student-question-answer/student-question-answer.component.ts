import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteConstant, REDIRECTION_FROM } from '@sharedModule/constants';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QuestionAnswerService } from '../../services';
import { AddAnswerDialogComponent } from '../add-answer-dialog/add-answer-dialog.component';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';
import { SharedService } from '@sharedModule/services';
import { StudentQuePreviewDialogComponent } from '../student-que-preview-dialog/student-que-preview-dialog.component';

@Component({
    selector: 'es-user-student-question-answer',
    templateUrl: './student-question-answer.component.html',
    styleUrls: ['./student-question-answer.component.scss']
})
export class StudentQuestionAnswerComponent implements OnInit, OnDestroy {

    questionId: string;
    questionDetail = null;
    redirectionFrom = REDIRECTION_FROM;

    subParams$;

    constructor(
        private location: Location,
        public router: Router,
        public dialog: MatDialog,
        private _activeRoute: ActivatedRoute,
        private questionAnswerService: QuestionAnswerService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.routerSubscriber();
    }

    routerSubscriber = () => {
        this.subParams$ = this._activeRoute.params.subscribe(params => {
            this.questionId = params['id'];
            this.getQuestionDetail();
        });
    };

    getQuestionDetail = () => {
        this.questionAnswerService.questionDetail(this.questionId).subscribe(response => {
            this.questionDetail = response.payload;
        })
    }

    onAddAnswer = () => {
        if (this.questionDetail.isEdit) {
            delete(this.questionDetail['isEdit']);
        }
        const dialogRef = this.dialog.open(AddAnswerDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: this.questionDetail
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getQuestionDetail();
            }
        });
    };

    onAnswerDelete = (event) => {
        if (event && event._id) {
            this.questionAnswerService.deleteComment(this.questionDetail?._id, event?._id)
                .subscribe(response => {
                    this.getQuestionDetail();
                });
        }
    }

    onQuestionDelete = (event) => {
        if (event && event._id) {
            this.questionAnswerService.deleteQuestion(event?._id)
                .subscribe(response => {
                    this.onBackClick();
                });
        }
    }

    onAnswerEdit = (event) => {
        const data = event;
        data['isEdit'] = true; 
        data['answerId'] = event._id
        data['_id'] = this.questionDetail._id;
        data['question'] = this.questionDetail.question;
        
        const dialogRef = this.dialog.open(AddAnswerDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: data
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.getQuestionDetail();
        });
    }

    onQuestionEdit = (event) => {
        const data = event;
        data['isEdit'] = true;
        this.onAddQuestionDialog(data);
    }

    onAddQuestionDialog(detail): void {
        const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: {detail}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // this.questionDetail = result;
                result['_id'] = this.questionId;
                this.onPreviewQuestionDialog(result);
            } else {
                this.getQuestionDetail();
            }
        }); 
    }

    onPreviewQuestionDialog(questionDetail) {
        const dialogRef = this.dialog.open(StudentQuePreviewDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: questionDetail
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const url = this.router.url;
                if (url === `/${RouteConstant.STUDENT_QUESTION_ANSWER}/${result}`) {
                    this.getQuestionDetail();
                } else {
                    this.router.navigate(['/' + RouteConstant.STUDENT_QUESTION_ANSWER, result]);
                }
            } else if (result != undefined) {
                this.onQuestionEdit(questionDetail);
            }
        });
    }    

    onBackClick = () => {
        const redirection = this.sharedService.getRedirectionFrom();
        switch(redirection) {
            case this.redirectionFrom.AllDoubts:
                this.router.navigate(['/' + RouteConstant.STUDENT_ALL_DOUBTS]);
                break;
            case this.redirectionFrom.YourDoubts:
                this.router.navigate(['/' + RouteConstant.STUDENT_DOUBT_LIST]);
                break;
            case this.redirectionFrom.BookmarkedDoubts:
                this.router.navigate(['/' + RouteConstant.STUDENT_ALL_BOOKMARK_DOUBTS]);
                break;
            default :
                this.router.navigate(['/' + RouteConstant.STUDENT_DOUBT_LIST]);
                break;
        }
    };

    ngOnDestroy() {
        if (this.subParams$.subscribe) {
            this.subParams$.unsubscribe();
        }
        this.sharedService.setRedirectionFrom(null);
    }
}
