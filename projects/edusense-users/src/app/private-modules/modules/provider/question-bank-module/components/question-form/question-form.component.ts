import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBaseComponent,
    ConfirmationMessageDialogComponent
} from '@sharedModule/components';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
    ValidationConstant,
    CommonRegexp,
    QuestionType,
    DifficultyLevelList,
    QuestionTypeList,
    FileSizeEnum
} from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBankService } from '../../service';
import {
    removeEmptyFields,
    isValidImageType,
    checkEmptyValue
} from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { MdEditorOption } from 'ngx-markdown-editor';
import { forkJoin } from 'rxjs';
import * as marked from 'marked';

interface UploadResult {
    isImg: boolean;
    id: number;
    url: string;
}

enum EditorRefType {
    QUESTION = 'question',
    SOLUTION = 'solution',
    OPTION_0 = 'option0',
    OPTION_1 = 'option1',
    OPTION_2 = 'option2',
    OPTION_3 = 'option3',
    OPTION_4 = 'option4',
    OPTION_5 = 'option5'
}

@Component({
    selector: 'es-user-question-form',
    templateUrl: './question-form.component.html',
    styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent extends FormBaseComponent implements OnInit {
    // Angular variables
    @Input() totalQuestions;
    @Input() selectedQues;
    @Output() isDelete = new EventEmitter<any>();
    @Output() isPreviousClick = new EventEmitter<any>();
    @Output() isSave = new EventEmitter<any>();
    @Output() isSaveAddNew = new EventEmitter<boolean>(false);

    // constant variables
    validationMsg = new ValidationConstant();
    questionType = QuestionType;
    difficultyLevelList = DifficultyLevelList;
    questionTypeList = QuestionTypeList;

    //Data variable
    uploadFile = [];
    questionDetail: any;
    selectedGradeAndSubject;
    previewContent: any = {};
    totalQuestionLength;
    questionImageSequence = 1;
    solutionImageSequence = 1;
    answerImageSequenceArray = {
        answerImageSeq_0: 1,
        answerImageSeq_1: 1,
        answerImageSeq_2: 1,
        answerImageSeq_3: 1,
        answerImageSeq_4: 1,
        answerImageSeq_5: 1
    };
    userConfigDetails;

    // Form Group variables
    questionBankForm: FormGroup;
    optionArray: FormArray;

    // Static Variables
    isSingleType = false;
    isMultiType = false;
    isBooleanType = false;
    preview = false;

    public options: MdEditorOption = {
        showPreviewPanel: false,
        enablePreviewContentClick: true,
        resizable: true,
        customRender: {
            image(href: string, title: string, text: string) {
                let out = `<img style="max-width: 100%;" src="${href}" alt="${text}"`;
                if (title) {
                    out += ` title="${title}"`;
                }
                out += (this.options as any).xhtml ? '/>' : '>';
                return out;
            }
        }
    };

    public question: MdEditorOption = {
        showPreviewPanel: false,
        enablePreviewContentClick: false,
        resizable: true,
        customRender: {
            image(href: string, title: string, text: string) {
                let out = `<img style="max-width: 100%;" src="${href}" alt="${text}"`;
                if (title) {
                    out += ` title="${title}"`;
                }
                out += (this.options as any).xhtml ? '/>' : '>';
                return out;
            }
        }
    };

    public radio_option: MdEditorOption = {
        showPreviewPanel: false,
        enablePreviewContentClick: false,
        resizable: true,
        customRender: {
            image(href: string, title: string, text: string) {
                let out = `<img style="max-width: 100%;" src="${href}" alt="${text}"`;
                if (title) {
                    out += ` title="${title}"`;
                }
                out += (this.options as any).xhtml ? '/>' : '>';
                return out;
            }
        }
    };

    public questioneditorRef: any;
    public editorRef: any;
    public optionEditorRef: any = {};
    public mode = 'editor';

    constructor(
        private _fb: FormBuilder,
        public dialog: MatDialog,
        private sharedService: SharedService,
        private questionBankService: QuestionBankService
    ) {
        super(_fb);
        this.preRender = this.preRender.bind(this);
        this.doUpload = this.doUpload.bind(this);
        this.postRender = this.postRender.bind(this);
    }

    ngOnInit(): void {
        this.intialize();
    }

    intialize = () => {
        this.userConfigDetails = this.sharedService.getUserConfig();
        this.selectedGradeAndSubject = this.questionBankService.getQuestionBankFilterData();
        this.createQuestionBankForm();
        this.questionTypeValueChanges();
        this.totalQuestions <= 1 ? this.formControls.ques_type.setValue(1) : '';
    };

    ngOnChanges() {
        this.totalQuestionLength = this.totalQuestions;
        if (this.selectedQues.questionId) {
            this.intialize();
            this.getQuestionDetail(this.selectedQues.questionId);
        } else if (
            this.selectedQues.questionId === 0 &&
            this.totalQuestions === 1
        ) {
            this.intialize();
            this.formControls.ques_type.setValue(1);
        }
    }

    // Create form method
    createQuestionBankForm = () => {
        this.questionBankForm = this.fb.group({
            ques_type: [
                { value: '', disabled: !this.showMoreOptions() },
                [Validators.required]
            ],
            difficulty_level: [
                { value: '', disabled: !this.showMoreOptions() },
                [Validators.required]
            ],
            marks: [
                { value: '', disabled: !this.showMoreOptions() },
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMBER_REGEXP)
                ]
            ],
            question: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(5000),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            questionAttachmentIds: [[]],
            options: this._fb.array([]),
            solution: [
                '',
                [Validators.minLength(2), Validators.maxLength(5000)]
            ],
            solutionAttachmentIds: [[]],
            showSolution: [{ value: true, disabled: !this.showMoreOptions() }],
            partialCredit: [false]
        });
    };

    createOptionsArrayForm(): FormGroup {
        return this.fb.group({
            answerId: [''],
            attachmentIds: [[]],
            content: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1000)
                ]
            ],
            correct: ['']
        });
    }

    questionTypeValueChanges = () => {
        this.optionArray = this.questionBankForm.get('options') as FormArray;
        this.formControls.ques_type.valueChanges.subscribe((value) => {
            this.clearFormArray(
                this.questionBankForm.get('options') as FormArray
            );
            let defaultOption = value === QuestionType.BOOLEAN ? 2 : 4;
            let optionsLength =
                this.questionDetail && this.questionDetail.type === value
                    ? this.questionDetail.questionAnswer.length
                    : defaultOption;
            for (let index = 0; index < optionsLength; index++) {
                this.optionArray.push(this.createOptionsArrayForm());
            }
            if (value === QuestionType.SINGLE) {
                this.isSingleType = true;
                this.isMultiType = false;
                this.isBooleanType = false;
            } else if (value === QuestionType.MULTI) {
                this.isSingleType = false;
                this.isMultiType = true;
                this.isBooleanType = false;
            } else if (value === QuestionType.BOOLEAN) {
                this.isSingleType = false;
                this.isMultiType = false;
                this.isBooleanType = true;
            }
        });
    };

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    };

    //Api calls
    addQuestionApiCall = (params) => {
        return this.questionBankService.addQuestion(params);
    };

    updateQuestionApiCall = (id, params) => {
        return this.questionBankService.updateQuestion(id, params);
    };

    getQuestionDetail = (questionId) => {
        this.preview = false;
        this.questionDetail = null;
        this.questionBankService
            .getQuestionDetail(questionId)
            .subscribe((response) => {
                this.handelQuestionDetailResponse(response);
            });
    };

    handelQuestionDetailResponse = (response) => {
        this.questionImageSequence = 1;
        this.solutionImageSequence = 1;
        this.answerImageSequenceArray = {
            answerImageSeq_0: 1,
            answerImageSeq_1: 1,
            answerImageSeq_2: 1,
            answerImageSeq_3: 1,
            answerImageSeq_4: 1,
            answerImageSeq_5: 1
        };
        this.questionDetail = response.payload;
        if (this.questionDetail.type !== this.questionType.MULTI) {
            this.questionDetail.questionAnswer.forEach((element, index) => {
                element.correct
                    ? (this.questionDetail.questionAnswer[
                          index
                      ].correct = index.toString())
                    : (this.questionDetail.questionAnswer[index].correct = '');
            });
        }
        if (this.questionDetail.questionImage.length) {
            this.questionDetail.questionImage.forEach((element) => {
                element['questionImageSequence'] = this.questionImageSequence;
                this.questionDetail.question = this.questionDetail.question.replace(
                    `{{img__${element.id}}}`,
                    `![img__${element.id}][${element.questionImageSequence}]`
                );
                this.questionDetail.question = this.questionDetail.question.concat(
                    `\r\n\n[${element.questionImageSequence}]:${element.url}\r\n`
                );
                this.questionImageSequence += 1;
            });
        }
        if (this.questionDetail.solutionImage.length) {
            this.questionDetail.solutionImage.forEach((element) => {
                element['solutionImageSequence'] = this.solutionImageSequence;
                this.questionDetail.solution = this.questionDetail.solution.replace(
                    `{{img__${element.id}}}`,
                    `![img__${element.id}][${element.solutionImageSequence}]`
                );
                this.questionDetail.solution = this.questionDetail.solution.concat(
                    `\r\n\n[${element.solutionImageSequence}]:${element.url}\r\n`
                );
                this.solutionImageSequence += 1;
            });
        }
        this.questionDetail.questionAnswer.forEach((element, index) => {
            element.attachmentIds = element.images;
            if (element.attachmentIds.length) {
                element.attachmentIds.forEach((attachment) => {
                    attachment[
                        'answerImageSeq_' + index
                    ] = this.answerImageSequenceArray[
                        'answerImageSeq_' + index
                    ];
                    element.content = element.content.replace(
                        `{{img__${attachment.id}}}`,
                        `![img__${attachment.id}][${
                            attachment['answerImageSeq_' + index]
                        }]`
                    );
                    element.content = element.content.concat(
                        `\r\n\n[${attachment['answerImageSeq_' + index]}]:${
                            attachment.url
                        }\r\n`
                    );
                    this.answerImageSequenceArray[
                        'answerImageSeq_' + index
                    ] += 1;
                });
            }
        });
        this.questionBankForm.patchValue({
            question: this.questionDetail.question,
            questionAttachmentIds: this.questionDetail.questionImage,
            showSolution: this.questionDetail.showSolution,
            partialCredit: this.questionDetail.partialCredit,
            difficulty_level: this.questionDetail.difficulty,
            ques_type: this.questionDetail.type,
            marks: this.questionDetail.score,
            options: this.questionDetail.questionAnswer,
            solution: this.questionDetail.solution,
            solutionAttachmentIds: this.questionDetail.solutionImage
        });
    };

    // Submit method
    onSubmitQuestionBankForm = (form: FormGroup, isAddNew) => {
        if (this.onSubmit(form)) {
            this.preview = false;
            let questionAttachment = form.value.questionAttachmentIds;
            let solutionAttachment = form.value.solutionAttachmentIds;
            let questionValue = form.value.question;
            let removeQuestionAttachment = [];
            let solutionValue = form.value.solution;
            let removeSolutionAttachment = [];
            let answerArray = form.value.options;
            let removeAnswerAttachment = [];
            if (questionAttachment.length) {
                questionAttachment.forEach((element) => {
                    questionValue = questionValue.replace(
                        `![img__${element.id}][${element.questionImageSequence}]`,
                        `{{img__${element.id}}}`
                    );
                    questionValue = questionValue.replace(
                        `[${element.questionImageSequence}]:${element.url}`,
                        ``
                    );
                });
                questionAttachment.forEach((element) => {
                    if (!questionValue.includes(`{{img__${element.id}}}`)) {
                        removeQuestionAttachment.push(element.id);
                    }
                });
            }
            if (solutionAttachment.length) {
                solutionAttachment.forEach((element) => {
                    solutionValue = solutionValue.replace(
                        `![img__${element.id}][${element.solutionImageSequence}]`,
                        `{{img__${element.id}}}`
                    );
                    solutionValue = solutionValue.replace(
                        `[${element.solutionImageSequence}]:${element.url}`,
                        ``
                    );
                });
                solutionAttachment.forEach((element) => {
                    if (!solutionValue.includes(`{{img__${element.id}}}`)) {
                        removeSolutionAttachment.push(element.id);
                    }
                });
            }
            answerArray.forEach((option, index) => {
                checkEmptyValue(option.correct) || option.correct === false
                    ? (option.correct = false)
                    : (option.correct = true);
                if (option.attachmentIds.length) {
                    option.attachmentIds.forEach((element) => {
                        option.content = option.content.replace(
                            `![img__${element.id}][${
                                element['answerImageSeq_' + index]
                            }]`,
                            `{{img__${element.id}}}`
                        );
                        option.content = option.content.replace(
                            `[${element['answerImageSeq_' + index]}]:${
                                element.url
                            }`,
                            ``
                        );
                    });
                    option.attachmentIds.forEach((element) => {
                        if (
                            !option.content.includes(`{{img__${element.id}}}`)
                        ) {
                            removeAnswerAttachment.push(element.id);
                        }
                    });
                    option.attachmentIds = option.attachmentIds.map(
                        (element) => element.id
                    );
                }
            });
            if (answerArray.filter((item) => item.correct).length) {
                const params = removeEmptyFields({
                    folderId: this.selectedGradeAndSubject.folderId,
                    difficulty: form.value.difficulty_level,
                    gradeId: this.selectedGradeAndSubject.grade_id,
                    multiAnswer: this.isMultiType,
                    question: questionValue,
                    questionAttachmentIds: questionAttachment.map(
                        (element) => element.id
                    ),
                    score: form.value.marks,
                    showSolution: form.value.showSolution,
                    solution: solutionValue,
                    solutionAttachmentIds: solutionAttachment.map(
                        (element) => element.id
                    ),
                    subjectId: this.selectedGradeAndSubject.subject_id,
                    type: form.value.ques_type,
                    answerRequest: answerArray
                });
                this.isSaveAddNew.emit(false);
                this.isSave.emit(false);
                this.isPreviousClick.emit(false);
                this.isDelete.emit(false);
                // console.log(params);
                forkJoin(
                    this.questionBankService.removeQuestionAttachment(
                        removeQuestionAttachment
                    ),
                    this.questionBankService.removeAnswerAttachment(
                        removeAnswerAttachment
                    ),
                    this.questionBankService.removeSolutionAttachment(
                        removeSolutionAttachment
                    )
                ).subscribe((allResponse) => {
                    if (this.selectedQues.questionId) {
                        this.updateQuestionApiCall(
                            this.selectedQues.questionId,
                            params
                        ).subscribe((response) => {
                            this.addNewQuestion(response.payload.type);
                            this.isSave.emit(response.payload);
                        });
                    } else {
                        this.addQuestionApiCall(params).subscribe(
                            (response) => {
                                // this.totalQuestions++;
                                this.isSaveAddNew.emit(response.payload);
                                this.addNewQuestion(response.payload.type);
                            }
                        );
                    }
                });
            } else {
                if (form.value.ques_type !== this.questionType.MULTI) {
                    form.value.options.forEach((option) => {
                        option.correct = '';
                    });
                }
                this.sharedService.setSnackBar('Please Select Answer');
            }
        }
    };

    onPreview = () => {
        if (this.onSubmit(this.questionBankForm)) {
            this.previewContent['quesType'] = this.formControls.ques_type.value;
            this.previewContent['question'] = this.formControls.question.value;
            this.previewContent['solution'] = this.formControls.solution.value;
            this.previewContent[
                'showSolution'
            ] = this.formControls.showSolution.value;
            this.previewContent['options'] = [
                ...this.formControls.options.value
            ];
            this.preview = true;
        }
    };

    onPreviousClick = () => {
        this.isSaveAddNew.emit(false);
        this.isSave.emit(false);
        this.isDelete.emit(false);
        this.isPreviousClick.emit(this.selectedQues);
    };

    // Add & remove question box
    addNewQuestion(type, isButton?): void {
        this.questionDetail = null;
        this.selectedQues['questionId'] = 0;
        this.createQuestionBankForm();
        this.questionTypeValueChanges();
        this.formControls.ques_type.setValue(type);
        this.totalQuestionLength = this.totalQuestions + 1;
        this.selectedQues['number'] = this.totalQuestionLength;
        this.selectedQues['prevQuestionId'] = -1;
        this.questionImageSequence = 1;
        this.solutionImageSequence = 1;
        this.answerImageSequenceArray = {
            answerImageSeq_0: 1,
            answerImageSeq_1: 1,
            answerImageSeq_2: 1,
            answerImageSeq_3: 1,
            answerImageSeq_4: 1,
            answerImageSeq_5: 1
        };
        this.totalQuestions = isButton
            ? this.totalQuestions + 1
            : this.totalQuestions;
    }

    // Add & reove options
    onAddOptions() {
        this.optionArray = this.questionBankForm.get('options') as FormArray;
        if (this.optionArray.length < 6) {
            this.optionArray.push(this.createOptionsArrayForm());
        }
    }

    removeOptionsFields(removeFieldIndex) {
        let removeIndex = removeFieldIndex;
        this.optionArray = this.questionBankForm.get('options') as FormArray;
        if (this.optionArray.length > 2) {
            this.optionArray.removeAt(removeFieldIndex);
            delete this.optionEditorRef['option' + removeFieldIndex];
            const newRef = {};
            let index = 0;
            for (const optionKey in this.optionEditorRef) {
                newRef['option' + index] = this.optionEditorRef[optionKey];
                index++;
            }
            this.optionEditorRef = newRef;
            const newSequence: any = {};
            for (let imageIndex = 0; imageIndex < 6; imageIndex++) {
                if (imageIndex >= removeFieldIndex) {
                    newSequence['answerImageSeq_' + imageIndex] = this
                        .answerImageSequenceArray[
                        'answerImageSeq_' + (imageIndex + 1)
                    ]
                        ? this.answerImageSequenceArray[
                              'answerImageSeq_' + (imageIndex + 1)
                          ]
                        : 1;
                } else {
                    newSequence[
                        'answerImageSeq_' + imageIndex
                    ] = this.answerImageSequenceArray[
                        'answerImageSeq_' + imageIndex
                    ];
                }
            }
            this.answerImageSequenceArray = newSequence;
            for (
                removeIndex;
                removeIndex < this.optionArray.value.length;
                removeIndex++
            ) {
                this.optionArray.value[removeIndex].attachmentIds.forEach(
                    (element) => {
                        element['answerImageSeq_' + removeIndex] =
                            element['answerImageSeq_' + (removeIndex + 1)];
                        delete element['answerImageSeq_' + (removeIndex + 1)];
                    }
                );
            }
        }
    }

    onDeleteQuestion = () => {
        const dialogRef = this.dialog.open(ConfirmationMessageDialogComponent, {
            data: {
                title: 'Confirmation',
                caption: 'Are you sure want to Remove Question?',
                primaryButtonLabel: 'Remove Question',
                secondaryButtonLabel: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isSaveAddNew.emit(false);
                this.isSave.emit(false);
                this.isPreviousClick.emit(false);
                this.questionBankService
                    .removeQuestion(this.selectedQues.questionId)
                    .subscribe((response) => {
                        this.questionDetail = null;
                        this.createQuestionBankForm();
                        this.questionTypeValueChanges();
                        this.formControls.ques_type.setValue(1);
                        this.questionImageSequence = 1;
                        this.solutionImageSequence = 1;
                        this.answerImageSequenceArray = {
                            answerImageSeq_0: 1,
                            answerImageSeq_1: 1,
                            answerImageSeq_2: 1,
                            answerImageSeq_3: 1,
                            answerImageSeq_4: 1,
                            answerImageSeq_5: 1
                        };
                        this.isDelete.emit(this.selectedQues);
                    });
            }
        });
    };

    radioChange = (event, index) => {
        if (event.source.checked) {
            this.optionArrayFormControls().controls.forEach((element, i) => {
                if (i !== index) {
                    element.get('correct').setValue('');
                }
            });
        }
    };

    isOptionRight = (option, isCheckbox = false) => {
        if (isCheckbox) {
            if (!option.correct) {
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

    togglePreviewPanel() {
        this.options.showPreviewPanel = !this.options.showPreviewPanel;
        this.options = Object.assign({}, this.options);
    }

    changeMode = () => {
        if (this.mode === 'editor') {
            this.mode = 'preview';
        } else {
            this.mode = 'editor';
        }
    };

    togglePreviewClick() {
        this.options.enablePreviewContentClick = !this.options
            .enablePreviewContentClick;
        this.options = Object.assign({}, this.options);
    }

    toggleResizeAble() {
        this.options.resizable = !this.options.resizable;
        this.options = Object.assign({}, this.options);
    }

    doUpload = (event, editorType): Promise<Array<UploadResult>> => {
        return new Promise((resolve, reject) => {
            const pointer = window.location.href.substring(
                window.location.href.lastIndexOf('/')
            );
            if (event.target.files && event.target.files[0]) {
                // const file = event.target.files[0];
                if (
                    !isValidImageType(event.target.files[0].type) ||
                    event.target.files[0].size > FileSizeEnum.FIVE_MB_IMAGE_SIZE
                ) {
                    event.target.value = null;
                    this.sharedService.setSnackBar(
                        'File format should be JPG/PNG/JPEG and Size should be less than 5 MB'
                    );
                } else {
                    this.uploadFile = [];
                    const result: Array<UploadResult> = [];
                    this.uploadFile.push({
                        reqKey: 'attachment',
                        files: event.target.files
                    });
                    switch (editorType) {
                        case EditorRefType.QUESTION:
                            let questionAttachment = this.formControls
                                .questionAttachmentIds.value;
                            let questionValue = this.questioneditorRef.getValue();
                            let questionCursorAt = this.questioneditorRef.selection.getRange();
                            let removeQuestionAttachment = [];
                            if (questionAttachment.length) {
                                questionAttachment.forEach((element) => {
                                    if (
                                        !questionValue.includes(
                                            `![img__${element.id}][${element.questionImageSequence}]`
                                        )
                                    ) {
                                        removeQuestionAttachment.push(element);
                                    }
                                });
                            }
                            let attachments = questionAttachment.filter(
                                (item) =>
                                    !removeQuestionAttachment
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachments.length < 5) {
                                this.questionBankService
                                    .uploadQuestionAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        response.payload[
                                            'questionImageSequence'
                                        ] = this.questionImageSequence;
                                        this.questioneditorRef.session.replace(
                                            questionCursorAt,
                                            `![img__${response.payload.id}][${response.payload.questionImageSequence}]`
                                        );
                                        attachments.push(response.payload);
                                        this.formControls.questionAttachmentIds.setValue(
                                            attachments
                                        );
                                        this.questionImageSequence++;
                                        this.questioneditorRef.gotoLine(
                                            this.questioneditorRef.session.getLength() +
                                                1
                                        );
                                        this.questioneditorRef.session.replace(
                                            this.questioneditorRef.selection.getRange(),
                                            `\n\n\n [${response.payload.questionImageSequence}]:${response.payload.url}\r\n`
                                        );
                                        if (removeQuestionAttachment.length) {
                                            this.questionBankService
                                                .removeQuestionAttachment(
                                                    removeQuestionAttachment.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeQuestionAttachment.forEach(
                                                        (element) => {
                                                            this.questioneditorRef.setValue(
                                                                this.questioneditorRef
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.questionImageSequence}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.questioneditorRef.gotoLine(
                                                        questionCursorAt
                                                    );
                                                });
                                        }
                                        this.questioneditorRef.gotoLine(
                                            questionCursorAt
                                        );
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 5 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.SOLUTION:
                            let solutionAttachment = this.formControls
                                .solutionAttachmentIds.value;
                            let solutionValue = this.editorRef.getValue();
                            let solutionCursorAt = this.editorRef.selection.getRange();
                            let removeSolutionAttachment = [];
                            if (solutionAttachment.length) {
                                solutionAttachment.forEach((element) => {
                                    if (
                                        !solutionValue.includes(
                                            `![img__${element.id}][${element.solutionImageSequence}]`
                                        )
                                    ) {
                                        removeSolutionAttachment.push(element);
                                    }
                                });
                            }
                            let attachment = solutionAttachment.filter(
                                (item) =>
                                    !removeSolutionAttachment
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment.length < 5) {
                                this.questionBankService
                                    .uploadSolutionAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        response.payload[
                                            'solutionImageSequence'
                                        ] = this.solutionImageSequence;
                                        this.editorRef.session.replace(
                                            solutionCursorAt,
                                            `![img__${response.payload.id}][${response.payload.solutionImageSequence}]`
                                        );
                                        attachment.push(response.payload);
                                        this.formControls.solutionAttachmentIds.setValue(
                                            attachment
                                        );
                                        this.solutionImageSequence++;
                                        this.editorRef.gotoLine(
                                            this.editorRef.session.getLength() +
                                                1
                                        );
                                        this.editorRef.session.replace(
                                            this.editorRef.selection.getRange(),
                                            `\n\n\n [${response.payload.solutionImageSequence}]:${response.payload.url}\r\n`
                                        );
                                        if (removeSolutionAttachment.length) {
                                            this.questionBankService
                                                .removeSolutionAttachment(
                                                    removeSolutionAttachment.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeSolutionAttachment.forEach(
                                                        (element) => {
                                                            this.editorRef.setValue(
                                                                this.editorRef
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.solutionImageSequence}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.editorRef.gotoLine(
                                                        solutionCursorAt
                                                    );
                                                });
                                        }
                                        this.editorRef.gotoLine(
                                            solutionCursorAt
                                        );
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 5 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.OPTION_0:
                            let answerAttachment_0 = this.formControls.options
                                .value[0].attachmentIds;
                            let optionCursor_0 = this.optionEditorRef[
                                EditorRefType.OPTION_0
                            ].selection.getRange();
                            let removeAnswer_0 = [];
                            if (answerAttachment_0.length) {
                                answerAttachment_0.forEach((element) => {
                                    if (
                                        !this.formControls.options.value[0].content.includes(
                                            `![img__${element.id}][${element.answerImageSeq_0}]`
                                        )
                                    ) {
                                        removeAnswer_0.push(element);
                                    }
                                });
                            }
                            let attachment_0 = answerAttachment_0.filter(
                                (item) =>
                                    !removeAnswer_0
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment_0.length < 2) {
                                this.questionBankService
                                    .uploadAnswerAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        this.uploadFile = [];
                                        response.payload[
                                            'answerImageSeq_0'
                                        ] = this.answerImageSequenceArray.answerImageSeq_0;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_0
                                        ].session.replace(
                                            optionCursor_0,
                                            `![img__${response.payload.id}][${response.payload.answerImageSeq_0}]`
                                        );
                                        attachment_0.push(response.payload);
                                        this.optionArrayFormControls().controls[0][
                                            'controls'
                                        ].attachmentIds.setValue(attachment_0);
                                        this.answerImageSequenceArray.answerImageSeq_0 += 1;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_0
                                        ].gotoLine(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_0
                                            ].session.getLength() + 1
                                        );
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_0
                                        ].session.replace(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_0
                                            ].selection.getRange(),
                                            `\n\n [${response.payload.answerImageSeq_0}]:${response.payload.url}\r\n`
                                        );
                                        if (removeAnswer_0.length) {
                                            this.questionBankService
                                                .removeAnswerAttachment(
                                                    removeAnswer_0.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeAnswer_0.forEach(
                                                        (element) => {
                                                            this.optionEditorRef[
                                                                EditorRefType
                                                                    .OPTION_0
                                                            ].setValue(
                                                                this.optionEditorRef[
                                                                    EditorRefType
                                                                        .OPTION_0
                                                                ]
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.answerImageSeq_0}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.optionEditorRef[
                                                        EditorRefType.OPTION_0
                                                    ].gotoLine(optionCursor_0);
                                                });
                                        }
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_0
                                        ].gotoLine(optionCursor_0);
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 2 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.OPTION_1:
                            let answerAttachment_1 = this.formControls.options
                                .value[1].attachmentIds;
                            let optionCursor_1 = this.optionEditorRef[
                                EditorRefType.OPTION_1
                            ].selection.getRange();
                            let removeAnswer_1 = [];
                            if (answerAttachment_1.length) {
                                answerAttachment_1.forEach((element) => {
                                    if (
                                        !this.formControls.options.value[1].content.includes(
                                            `![img__${element.id}][${element.answerImageSeq_1}]`
                                        )
                                    ) {
                                        removeAnswer_1.push(element);
                                    }
                                });
                            }
                            let attachment_1 = answerAttachment_1.filter(
                                (item) =>
                                    !removeAnswer_1
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment_1.length < 2) {
                                this.questionBankService
                                    .uploadAnswerAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        this.uploadFile = [];
                                        response.payload[
                                            'answerImageSeq_1'
                                        ] = this.answerImageSequenceArray.answerImageSeq_1;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_1
                                        ].session.replace(
                                            optionCursor_1,
                                            `![img__${response.payload.id}][${response.payload.answerImageSeq_1}]`
                                        );
                                        attachment_1.push(response.payload);
                                        this.optionArrayFormControls().controls[1][
                                            'controls'
                                        ].attachmentIds.setValue(attachment_1);
                                        this.answerImageSequenceArray.answerImageSeq_1 += 1;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_1
                                        ].gotoLine(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_1
                                            ].session.getLength() + 1
                                        );
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_1
                                        ].session.replace(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_1
                                            ].selection.getRange(),
                                            `\n\n [${response.payload.answerImageSeq_1}]:${response.payload.url}\r\n`
                                        );
                                        if (removeAnswer_1.length) {
                                            this.questionBankService
                                                .removeAnswerAttachment(
                                                    removeAnswer_1.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeAnswer_1.forEach(
                                                        (element) => {
                                                            this.optionEditorRef[
                                                                EditorRefType
                                                                    .OPTION_1
                                                            ].setValue(
                                                                this.optionEditorRef[
                                                                    EditorRefType
                                                                        .OPTION_1
                                                                ]
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.answerImageSeq_1}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.optionEditorRef[
                                                        EditorRefType.OPTION_1
                                                    ].gotoLine(optionCursor_1);
                                                });
                                        }
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_1
                                        ].gotoLine(optionCursor_1);
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 2 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.OPTION_2:
                            let answerAttachment_2 = this.formControls.options
                                .value[2].attachmentIds;
                            let optionCursor_2 = this.optionEditorRef[
                                EditorRefType.OPTION_2
                            ].selection.getRange();
                            let removeAnswer_2 = [];
                            if (answerAttachment_2.length) {
                                answerAttachment_2.forEach((element) => {
                                    if (
                                        !this.formControls.options.value[2].content.includes(
                                            `![img__${element.id}][${element.answerImageSeq_2}]`
                                        )
                                    ) {
                                        removeAnswer_2.push(element);
                                    }
                                });
                            }
                            let attachment_2 = answerAttachment_2.filter(
                                (item) =>
                                    !removeAnswer_2
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment_2.length < 2) {
                                this.questionBankService
                                    .uploadAnswerAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        this.uploadFile = [];
                                        response.payload[
                                            'answerImageSeq_2'
                                        ] = this.answerImageSequenceArray.answerImageSeq_2;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_2
                                        ].session.replace(
                                            optionCursor_2,
                                            `![img__${response.payload.id}][${response.payload.answerImageSeq_2}]`
                                        );
                                        attachment_2.push(response.payload);
                                        this.optionArrayFormControls().controls[2][
                                            'controls'
                                        ].attachmentIds.setValue(attachment_2);
                                        this.answerImageSequenceArray.answerImageSeq_2 += 1;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_2
                                        ].gotoLine(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_2
                                            ].session.getLength() + 1
                                        );
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_2
                                        ].session.replace(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_2
                                            ].selection.getRange(),
                                            `\n\n [${response.payload.answerImageSeq_2}]:${response.payload.url}\r\n`
                                        );
                                        if (removeAnswer_2.length) {
                                            this.questionBankService
                                                .removeAnswerAttachment(
                                                    removeAnswer_2.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeAnswer_2.forEach(
                                                        (element) => {
                                                            this.optionEditorRef[
                                                                EditorRefType
                                                                    .OPTION_2
                                                            ].setValue(
                                                                this.optionEditorRef[
                                                                    EditorRefType
                                                                        .OPTION_2
                                                                ]
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.answerImageSeq_2}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.optionEditorRef[
                                                        EditorRefType.OPTION_2
                                                    ].gotoLine(optionCursor_2);
                                                });
                                        }
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_2
                                        ].gotoLine(optionCursor_2);
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 2 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.OPTION_3:
                            let answerAttachment_3 = this.formControls.options
                                .value[3].attachmentIds;
                            let optionCursor_3 = this.optionEditorRef[
                                EditorRefType.OPTION_3
                            ].selection.getRange();
                            let removeAnswer_3 = [];
                            if (answerAttachment_3.length) {
                                answerAttachment_3.forEach((element) => {
                                    if (
                                        !this.formControls.options.value[3].content.includes(
                                            `![img__${element.id}][${element.answerImageSeq_3}]`
                                        )
                                    ) {
                                        removeAnswer_3.push(element);
                                    }
                                });
                            }
                            let attachment_3 = answerAttachment_3.filter(
                                (item) =>
                                    !removeAnswer_3
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment_3.length < 2) {
                                this.questionBankService
                                    .uploadAnswerAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        this.uploadFile = [];
                                        response.payload[
                                            'answerImageSeq_3'
                                        ] = this.answerImageSequenceArray.answerImageSeq_3;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_3
                                        ].session.replace(
                                            optionCursor_3,
                                            `![img__${response.payload.id}][${response.payload.answerImageSeq_3}]`
                                        );
                                        attachment_3.push(response.payload);
                                        this.optionArrayFormControls().controls[3][
                                            'controls'
                                        ].attachmentIds.setValue(attachment_3);
                                        this.answerImageSequenceArray.answerImageSeq_3 += 1;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_3
                                        ].gotoLine(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_3
                                            ].session.getLength() + 1
                                        );
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_3
                                        ].session.replace(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_3
                                            ].selection.getRange(),
                                            `\n\n [${response.payload.answerImageSeq_3}]:${response.payload.url}\r\n`
                                        );
                                        if (removeAnswer_3.length) {
                                            this.questionBankService
                                                .removeAnswerAttachment(
                                                    removeAnswer_3.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeAnswer_3.forEach(
                                                        (element) => {
                                                            this.optionEditorRef[
                                                                EditorRefType
                                                                    .OPTION_3
                                                            ].setValue(
                                                                this.optionEditorRef[
                                                                    EditorRefType
                                                                        .OPTION_3
                                                                ]
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.answerImageSeq_3}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.optionEditorRef[
                                                        EditorRefType.OPTION_3
                                                    ].gotoLine(optionCursor_3);
                                                });
                                        }
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_3
                                        ].gotoLine(optionCursor_3);
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 2 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.OPTION_4:
                            let answerAttachment_4 = this.formControls.options
                                .value[4].attachmentIds;
                            let optionCursor_4 = this.optionEditorRef[
                                EditorRefType.OPTION_4
                            ].selection.getRange();
                            let removeAnswer_4 = [];
                            if (answerAttachment_4.length) {
                                answerAttachment_4.forEach((element) => {
                                    if (
                                        !this.formControls.options.value[4].content.includes(
                                            `![img__${element.id}][${element.answerImageSeq_4}]`
                                        )
                                    ) {
                                        removeAnswer_4.push(element);
                                    }
                                });
                            }
                            let attachment_4 = answerAttachment_4.filter(
                                (item) =>
                                    !removeAnswer_4
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment_4.length < 2) {
                                this.questionBankService
                                    .uploadAnswerAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        this.uploadFile = [];
                                        response.payload[
                                            'answerImageSeq_4'
                                        ] = this.answerImageSequenceArray.answerImageSeq_4;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_4
                                        ].session.replace(
                                            optionCursor_4,
                                            `![img__${response.payload.id}][${response.payload.answerImageSeq_4}]`
                                        );
                                        attachment_4.push(response.payload);
                                        this.optionArrayFormControls().controls[4][
                                            'controls'
                                        ].attachmentIds.setValue(attachment_4);
                                        this.answerImageSequenceArray.answerImageSeq_4 += 1;

                                        this.optionEditorRef[
                                            EditorRefType.OPTION_4
                                        ].gotoLine(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_4
                                            ].session.getLength() + 1
                                        );
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_4
                                        ].session.replace(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_4
                                            ].selection.getRange(),
                                            `\n\n [${response.payload.answerImageSeq_4}]:${response.payload.url}\r\n`
                                        );
                                        if (removeAnswer_4.length) {
                                            this.questionBankService
                                                .removeAnswerAttachment(
                                                    removeAnswer_4.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeAnswer_4.forEach(
                                                        (element) => {
                                                            this.optionEditorRef[
                                                                EditorRefType
                                                                    .OPTION_4
                                                            ].setValue(
                                                                this.optionEditorRef[
                                                                    EditorRefType
                                                                        .OPTION_4
                                                                ]
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.answerImageSeq_4}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.optionEditorRef[
                                                        EditorRefType.OPTION_4
                                                    ].gotoLine(optionCursor_4);
                                                });
                                        }
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_4
                                        ].gotoLine(optionCursor_4);
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 2 Image not more than that'
                                );
                            }
                            break;
                        case EditorRefType.OPTION_5:
                            let answerAttachment_5 = this.formControls.options
                                .value[5].attachmentIds;
                            let optionCursor_5 = this.optionEditorRef[
                                EditorRefType.OPTION_5
                            ].selection.getRange();
                            let removeAnswer_5 = [];
                            if (answerAttachment_5.length) {
                                answerAttachment_5.forEach((element) => {
                                    if (
                                        !this.formControls.options.value[5].content.includes(
                                            `![img__${element.id}][${element.answerImageSeq_5}]`
                                        )
                                    ) {
                                        removeAnswer_5.push(element);
                                    }
                                });
                            }
                            let attachment_5 = answerAttachment_5.filter(
                                (item) =>
                                    !removeAnswer_5
                                        .map((item) => item.id)
                                        .includes(item.id)
                            );
                            if (attachment_5.length < 2) {
                                this.questionBankService
                                    .uploadAnswerAttachment(this.uploadFile)
                                    .subscribe((response) => {
                                        event.target.value = null;
                                        this.uploadFile = [];
                                        response.payload[
                                            'answerImageSeq_5'
                                        ] = this.answerImageSequenceArray.answerImageSeq_5;
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_5
                                        ].session.replace(
                                            optionCursor_5,
                                            `![img__${response.payload.id}][${response.payload.answerImageSeq_5}]`
                                        );

                                        attachment_5.push(response.payload);
                                        this.optionArrayFormControls().controls[5][
                                            'controls'
                                        ].attachmentIds.setValue(attachment_5);
                                        this.answerImageSequenceArray.answerImageSeq_5 += 1;

                                        this.optionEditorRef[
                                            EditorRefType.OPTION_5
                                        ].gotoLine(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_5
                                            ].session.getLength() + 1
                                        );
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_5
                                        ].session.replace(
                                            this.optionEditorRef[
                                                EditorRefType.OPTION_5
                                            ].selection.getRange(),
                                            `\n\n [${response.payload.answerImageSeq_5}]:${response.payload.url}\r\n`
                                        );

                                        if (removeAnswer_5.length) {
                                            this.questionBankService
                                                .removeAnswerAttachment(
                                                    removeAnswer_5.map(
                                                        (item) => item.id
                                                    )
                                                )
                                                .subscribe((response) => {
                                                    removeAnswer_5.forEach(
                                                        (element) => {
                                                            this.optionEditorRef[
                                                                EditorRefType
                                                                    .OPTION_5
                                                            ].setValue(
                                                                this.optionEditorRef[
                                                                    EditorRefType
                                                                        .OPTION_5
                                                                ]
                                                                    .getValue()
                                                                    .replace(
                                                                        `[${element.answerImageSeq_5}]:${element.url}`,
                                                                        ``
                                                                    )
                                                            );
                                                        }
                                                    );
                                                    this.optionEditorRef[
                                                        EditorRefType.OPTION_5
                                                    ].gotoLine(optionCursor_5);
                                                });
                                        }
                                        this.optionEditorRef[
                                            EditorRefType.OPTION_5
                                        ].gotoLine(optionCursor_5);
                                    });
                            } else {
                                event.target.value = null;
                                this.sharedService.setSnackBar(
                                    'it should allow max 2 Image not more than that'
                                );
                            }
                            break;
                        default:
                            event.target.value = null;
                            break;
                    }
                    resolve(result);
                }
            }
        });
    };

    onEditorLoaded = (editor, editorType) => {
        switch (editorType) {
            case EditorRefType.QUESTION:
                this.questioneditorRef = editor;
                break;
            case EditorRefType.SOLUTION:
                this.editorRef = editor;
                break;
            case EditorRefType.OPTION_0:
                this.optionEditorRef[editorType] = editor;
                break;
            case EditorRefType.OPTION_1:
                this.optionEditorRef[editorType] = editor;
                break;
            case EditorRefType.OPTION_2:
                this.optionEditorRef[editorType] = editor;
                break;
            case EditorRefType.OPTION_3:
                this.optionEditorRef[editorType] = editor;
                break;
            case EditorRefType.OPTION_4:
                this.optionEditorRef[editorType] = editor;
                break;
            case EditorRefType.OPTION_5:
                this.optionEditorRef[editorType] = editor;
                break;
            default:
                break;
        }
    };

    preRender = (mdContent) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mdContent);
            }, 4000);
        });
        return mdContent;
    };

    postRender = (html) => {
        return html;
    };

    convertMarkDownToHtml = (value) => {
        if (!checkEmptyValue(value)) {
            return marked(value);
        }
    };

    onBrowseFile(id) {
        document.getElementById(id).click();
    }

    onBack = () => {
        this.preview = false;
    };

    get formControls() {
        return this.questionBankForm.controls;
    }

    optionArrayFormControls(): FormArray {
        return this.questionBankForm.get('options') as FormArray;
    }

    showMoreOptions = () => {
        return (
            this.userConfigDetails.user_id ===
            this.selectedGradeAndSubject.createdBy
        );
    };
}
