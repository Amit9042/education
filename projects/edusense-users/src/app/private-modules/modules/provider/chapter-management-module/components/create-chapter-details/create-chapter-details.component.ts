import { Component, Inject, OnInit } from '@angular/core';
import { FormBaseComponent } from '@sharedModule/components';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectSearchModel } from '@sharedModule/components/ss-select-search/select-search.model';
import { CommonRegexp, ValidationConstant } from '@sharedModule/constants';
import { MaterialGrade, MaterialSubject } from '@sharedModule/models';
import { appLogger, removeEmptyFields } from '@sharedModule/functions';
import { ChapterManagementService } from '../../services';
import { ChapterManagementListModel } from '../../models';

@Component({
    selector: 'es-user-create-chapter-details',
    templateUrl: './create-chapter-details.component.html',
    styleUrls: ['./create-chapter-details.component.scss']
})
export class CreateChapterDetailsComponent extends FormBaseComponent
    implements OnInit {
    // Form Variables
    myControl = new FormControl();
    createChapterForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // Data variables
    gradeList: MaterialGrade[] = [];
    subjectList: MaterialSubject[] = [];
    chapterDetails: ChapterManagementListModel;
    selectedGrade: MaterialGrade;
    selectedSubject: MaterialSubject;

    // Config variables

    gradeSearchConfig: SelectSearchModel = {
        displayLabel: 'Grade',
        controlName: 'grade',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Grade',
        selectPlaceholderLabel: 'Search grade',
        isRequired: true,
        validationMsg: this.validationMsg.GRADE,
        selectMulti: false,
        selectedValueCompairId: 'grade_id'
    };

    subjectSearchConfig: SelectSearchModel = {
        displayLabel: 'Subject',
        controlName: 'subject',
        keyPath: 'name',
        searchKey: 'name',
        searchPlaceholderLabel: 'Subject',
        selectPlaceholderLabel: 'Search subject',
        isRequired: true,
        validationMsg: this.validationMsg.SUBJECT,
        selectMulti: false,
        selectedValueCompairId: 'subject_id'
    };

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateChapterDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private chapterManagementService: ChapterManagementService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.initialize();
    }

    // Initialisation methods
    initialize = () => {
        this.gradeList =
            this.data && this.data['gradeList'] ? this.data['gradeList'] : [];
        this.subjectList =
            this.data && this.data['subjectList']
                ? this.data['subjectList']
                : [];
        if (this.data && this.data['chapterDetails']) {
            this.chapterDetails = this.data['chapterDetails'];
            this.selectedGrade = this.gradeList.find(
                record => record.grade_id === this.chapterDetails.gradeId
            );
            this.selectedSubject = this.subjectList.find(
                record => record.subject_id === this.chapterDetails.subjectId
            );
        }
        this.createCreateChapterForm();
    };

    createCreateChapterForm = () => {
        this.createChapterForm = this.createForm({
            title: [
                this.chapterDetails ? this.chapterDetails.title : '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ],
            description: [
                this.chapterDetails ? this.chapterDetails.description : '',
                [Validators.minLength(2), Validators.maxLength(200)]
            ],
            grade: [
                {
                    value: '',
                    disabled: this.chapterDetails
                },
                [Validators.required]
            ],
            subject: [
                {
                    value: '',
                    disabled: this.chapterDetails
                },
                [Validators.required]
            ]
        });
    };

    // API Calls
    createOrEditChapterApiCall = (params: any) => {
        if (this.chapterDetails) {
            return this.chapterManagementService.editProviderChapter(
                params,
                this.chapterDetails.id
            );
        } else {
            return this.chapterManagementService.createProviderChapter(params);
        }
    };

    // Page events
    onSubmitCreateChapterForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            let params = form.getRawValue();
            params['gradeId'] = params['grade']['grade_id'];
            params['subjectId'] = params['subject']['subject_id'];
            params = removeEmptyFields(params);
            this.createOrEditChapterApiCall(params).subscribe(response => {
                this.onCloseDialog(true);
            });
        }
    };

    onSelectChangeEvent(event, flag) {
        appLogger(event);
        this.formControls[flag].setValue(event);
    }

    // Helpers
    get formControls() {
        return this.createChapterForm.controls;
    }

    onCloseDialog(flag: boolean) {
        this.dialogRef.close(flag);
    }
}
