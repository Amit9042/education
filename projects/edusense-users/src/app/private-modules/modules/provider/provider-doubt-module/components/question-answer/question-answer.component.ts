import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteConstant, REDIRECTION_FROM } from '@sharedModule/constants';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QuestionAnswerService } from '../../services';
import { ProviderAddAnswerDialogComponent } from '../provider-add-answer-dialog/provider-add-answer-dialog.component';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-question-answer',
    templateUrl: './question-answer.component.html',
    styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnInit, OnDestroy {

    questionId: string;
    subParams$

    redirectionFrom = REDIRECTION_FROM;
    questionDetail;

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

    onAddAnswer = (data) => {
        const dialogRef = this.dialog.open(ProviderAddAnswerDialogComponent, {
            panelClass: 'meeting-dialog-container',
            data: data
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
        data['answerId'] = event.answerId ? event.answerId : event._id;
        data['_id'] = this.questionDetail._id;
        data['question'] = this.questionDetail.question;
        this.onAddAnswer(data);
    }

    onQuestionEdit = (event) => {
        
    }

    onBackClick = () => {
        const redirection = this.sharedService.getRedirectionFrom();
        switch(redirection) {
            case this.redirectionFrom.AllDoubts:
                this.router.navigate(['/' + RouteConstant.PROVIDER_ALL_DOUBTS]);
                break;
            case this.redirectionFrom.YourDoubts:
                this.router.navigate(['/' + RouteConstant.PROVIDER_RECIEVED_DOUBTS]);
                break;
            default :
                this.router.navigate(['/' + RouteConstant.PROVIDER_RECIEVED_DOUBTS]);
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
