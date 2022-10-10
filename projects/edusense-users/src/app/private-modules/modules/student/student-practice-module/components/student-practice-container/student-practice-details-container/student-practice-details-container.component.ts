import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationConstant } from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
    StudentPracticeDetailsModel,
    StudentPracticeResultModel,
    StudentQuestionModel,
    StudentQuestionsListModel
} from '../../../models';
import { MaterialSubject } from '@sharedModule/models';
import { StudentPracticeService } from '../../../services';
import { Location } from '@angular/common';
import { PracticeResultDialogComponent } from '../../practice-result-dialog/practice-result-dialog.component';
import { EnterpriseDetail } from '../../../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-student-practice-details-container',
    templateUrl: './student-practice-details-container.component.html',
    styleUrls: ['./student-practice-details-container.component.scss']
})
export class StudentPracticeDetailsContainerComponent
    extends FormBaseComponent
    implements OnInit, OnDestroy {
    // FormGroup Variables
    practiceQuestionForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // Data variables
    practiceDetails: StudentPracticeDetailsModel;
    studentQuestionList: StudentQuestionsListModel[] = [];
    subject: MaterialSubject;
    questionDetail: StudentQuestionModel;
    practiceResult: StudentPracticeResultModel;
    selectedQuestionNumber = 1;
    answerSubmitted = false;
    showResult = false;
    activeEnterprise: EnterpriseDetail;

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private studentPracticeService: StudentPracticeService,
        public location: Location,
        private sharedService: SharedService
    ) {
        super(fb);
    }

    // Initialisation methods
    ngOnInit() {
        this.initialize();
    }

    // Initialisation methods
    initialize = () => {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.createPracticeQuestionForm();
        this.routeSubscriber();
    };

    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.practiceDetails) {
                this.practiceDetails = resolvedData.practiceDetails;
                if (resolvedData.subjectList) {
                    let subjectList: MaterialSubject[] =
                        resolvedData.subjectList;
                    this.subject = subjectList.find(
                        (record) =>
                            record.subject_id === this.practiceDetails.subjectId
                    );
                }
            }
            if (resolvedData.studentQuestionList) {
                this.studentQuestionList = resolvedData.studentQuestionList.sort(
                    (a, b) => a.serialNumber - b.serialNumber
                );
                this.studentQuestionList.forEach((record, index) => {
                    record['questionSequence'] = index + 1;
                });
                let question = this.studentQuestionList.find(
                    (record) => !record.status
                );
                if (question) {
                    this.getQuestionDetails(question);
                } else {
                    this.practiceDetails['practiseId'] = this.practiceDetails[
                        'id'
                    ];
                    this.practiceDetails['practiseName'] = this.practiceDetails[
                        'name'
                    ];
                    delete this.practiceDetails['id'];
                    delete this.practiceDetails['name'];
                    const practiceId = this.practiceDetails.practiseId;
                    const questionId = this.studentQuestionList[0][
                        'questionId'
                    ];
                    this.getPreviousQuestionApiCall(
                        practiceId,
                        questionId
                    ).subscribe((response) => {
                        this.handleQuestionSelectionResponse(response);
                    });
                }
            }
        });
    };

    createPracticeQuestionForm = () => {
        this.practiceQuestionForm = this.fb.group({
            selectAll: ['', []],
            questions: this.fb.array([this.selectQuestion()]),
            viewQuestions: this.fb.array([this.selectAnswer()])
        });
    };

    // API Calls
    getQuestionDetailsApiCalls = (questionId) => {
        return this.studentPracticeService.loadQuestionForPractise(questionId);
    };

    submitQuizAnswerApiCalls = (practiseSession, params) => {
        return this.studentPracticeService.submitAnswer(
            practiseSession,
            params,
            this.activeEnterprise.provider_uuid
        );
    };

    getPreviousQuestionApiCall = (practiceId, questionId) => {
        return this.studentPracticeService.getPreviosQuestion(
            practiceId,
            questionId,
            {
                providerUUID: this.activeEnterprise.provider_uuid
            }
        );
    };

    finishPracticeApiCall = (practiseSession) => {
        return this.studentPracticeService.finishPractise(
            practiseSession,
            this.activeEnterprise.provider_uuid
        );
    };

    pausePracticeApiCall = (practiseSession) => {
        return this.studentPracticeService.pausePractise(
            practiseSession,
            this.activeEnterprise.provider_uuid
        );
    };

    getStudentQuestionListApiCall = (practiceId, filterArray) => {
        return this.studentPracticeService.getPracticeQuestions(
            practiceId,
            filterArray,
            this.activeEnterprise.provider_uuid
        );
    };

    // Page events
    getQuestionDetails = (question: StudentQuestionsListModel) => {
        this.getQuestionDetailsApiCalls(question.questionId).subscribe(
            (response) => {
                this.answerSubmitted = false;
                this.selectedQuestionNumber = question.questionSequence;
                this.handelQuestionDetailResponse(response.payload);
            }
        );
    };

    getRandomQuestionDetails = (question: StudentQuestionsListModel) => {
        if (question) {
            this.getPreviousQuestionApiCall(
                this.practiceDetails.practiseId,
                question.questionId
            ).subscribe((response) => {
                this.selectedQuestionNumber = question.questionSequence;
                this.handleQuestionSelectionResponse(response);
            });
        } else {
            let question = this.studentQuestionList.find(
                (record) => !record.status
            );
            if (question) {
                this.getQuestionDetails(question);
            }
        }
    };

    handleQuestionSelectionResponse = (response: any) => {
        let question = response.payload;
        this.handelQuestionDetailResponse(question.questionDTO);
        this.questionDetail.questionBookmarked = question.questionBookmarked;
        this.questionDetail.selectedAnswerIds = question.selectedAnswerIds;
        this.questionDetail.currectAnswerIds = question.questionDTO.questionAnswer
            .filter((item) => {
                return item.correct;
            })
            .map((option) => option.answerId);
        this.answerSubmitted = true;
    };

    handelQuestionDetailResponse = (response) => {
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
        this.questionDetail = question;
    };

    getStudentQuestionList = (practiceId, filterArray) => {
        this.getStudentQuestionListApiCall(practiceId, filterArray).subscribe(
            (response) => {
                let questionArray: StudentQuestionsListModel[] =
                    response['payload'];
                this.studentQuestionList = questionArray.sort(
                    (a, b) => a.serialNumber - b.serialNumber
                );
                this.studentQuestionList.forEach((record, index) => {
                    record['questionSequence'] = index + 1;
                });
            }
        );
    };

    selectQuestion(): FormGroup {
        return this.fb.group({
            chkSelectQue: ['', []]
        });
    }

    selectAnswer(): FormGroup {
        return this.fb.group({
            radioAnswer: ['', []],
            chkAnswer: ['', []]
        });
    }

    onPracticeResultOpen = (result: StudentPracticeResultModel) => {
        const dialogRef = this.dialog.open(PracticeResultDialogComponent, {
            panelClass: 'practice-result-dialog-container',
            data: result
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.onBack();
            }
        });
    };

    onPracticeQuestionFormSubmit = (event) => {
        let params = event;
        let question = this.studentQuestionList.filter(
            (item) => item.questionId === params.questionId
        );
        params['serialNumber'] = question[0].serialNumber;
        this.submitQuizAnswerApiCalls(
            this.practiceDetails.session,
            params
        ).subscribe((response) => {
            this.getStudentQuestionList(this.practiceDetails.practiseId, []);
            let question = response.payload;
            if (
                question.solutionAttachmentList &&
                question.solutionAttachmentList.length
            ) {
                question.solutionAttachmentList.forEach((element) => {
                    question.solution = question.solution.replace(
                        `{{img__${element.id}}}`,
                        `![img__${element.id}](${element.url})`
                    );
                });
            }
            this.questionDetail.solution = question.solution;
            this.questionDetail.currectAnswerIds = question.answerIds;
            this.questionDetail.solutionImage = question.solutionAttachmentList;
            this.questionDetail.selectedAnswerIds = question.selectedAnswerIds;
            this.answerSubmitted = true;
            if (
                this.studentQuestionList.length === this.selectedQuestionNumber
            ) {
                this.finishPracticeApiCall(
                    this.practiceDetails.session
                ).subscribe((response) => {
                    this.practiceResult = response.payload;
                    this.showResult = true;
                    this.studentPracticeService.setIsPracitceDetailView(true);
                });
            }
        });
    };

    onPreviousClick = (event) => {
        if (event) {
            this.selectedQuestionNumber--;
            this.getPreviousQuestionApiCall(
                this.practiceDetails.practiseId,
                this.studentQuestionList[this.selectedQuestionNumber - 1]
                    .questionId
            ).subscribe((response) => {
                this.handleQuestionSelectionResponse(response);
            });
        }
    };

    onNextClick = (event) => {
        if (event) {
            let question = this.studentQuestionList[
                this.selectedQuestionNumber
            ];
            if (!question.status) {
                this.getQuestionDetails(question);
            } else {
                this.getPreviousQuestionApiCall(
                    this.practiceDetails.practiseId,
                    question.questionId
                ).subscribe((response) => {
                    this.selectedQuestionNumber = question.questionSequence;
                    this.handleQuestionSelectionResponse(response);
                });
            }
        }
    };

    onViewResultClick = (event) => {
        if (event) {
            this.practiceResult[
                'practiseName'
            ] = this.practiceDetails.practiseName;
            this.onPracticeResultOpen(this.practiceResult);
        }
    };

    onBackConfirm = (flag) => {
        if (flag) {
            this.pausePracticeApiCall(this.practiceDetails.session).subscribe(
                (response) => {
                    this.onBack();
                }
            );
        }
    };

    onBack = () => {
        this.location.back();
    };

    // Helpers
    get formControls() {
        return this.practiceQuestionForm.controls;
    }

    get formArrayControlsLeft() {
        return this.practiceQuestionForm.get('questions') as FormArray;
    }

    ngOnDestroy() {
        this.studentPracticeService.setIsPracitceDetailView(false);
    }
}
