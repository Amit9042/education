import { Component, OnInit, Inject } from '@angular/core';
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { SelectQuestionBankPracticeDialogComponent } from '../select-question-bank-practice-dialog/select-question-bank-practice-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    ValidationConstant,
    CommonRegexp,
    RouteConstant
} from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { PracticeService } from '../../../service';
import { SharedService } from '@sharedModule/services';
import { SelectSearchModel } from 'utility-lib';
import { ChapterManagementListModel } from '../../../../chapter-management-module/models';
import { Router } from '@angular/router';
import { ParentClasses } from '@sharedModule/models';

@Component({
    selector: 'es-user-add-practice-dialog',
    templateUrl: './practice-details-dialog.component.html',
    styleUrls: ['./practice-details-dialog.component.scss']
})
export class PracticeDetailsDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form group variables
    addPracticeForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // Data related variables
    selectedFolderList: any[] = [];
    selectedChapter = null;
    selectedClasses = [];
    selectedGradeAndSubject;

    // Select Search Variables
    chapterList: ChapterManagementListModel[] = [];
    parentClassList: ParentClasses[] = [];
    chapterSearchConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'chapterMasterId',
        filterControlName: 'classFilter',
        keyPath: 'title',
        searchKey: 'title',
        searchPlaceholderLabel: 'Search chapter',
        selectPlaceholderLabel: 'Select chapter',
        isRequired: false,
        selectMulti: false,
        selectedValueCompairId: 'class_id',
        validationMsg: ''
    };

    classSelectConfig: SelectSearchModel = {
        displayLabel: '',
        controlName: 'parentClassIds',
        filterControlName: 'classFilter',
        keyPath: 'class_name',
        searchKey: 'class_name',
        searchPlaceholderLabel: 'Search class',
        selectPlaceholderLabel: 'Select class',
        isRequired: false,
        selectMulti: true,
        selectedValueCompairId: 'parent_class_id',
        validationMsg: ''
    };

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<PracticeDetailsDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        fb: FormBuilder,
        private practiceService: PracticeService,
        private sharedService: SharedService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.createAddPracticeForm();
        this.selectedGradeAndSubject = this.data;
        if (this.data && this.data.parentClassList) {
            this.parentClassList = this.data.parentClassList;
        }
        if (this.data && this.data.chapters) {
            this.selectedFolderList = this.data.chapters;
        }
        if (this.data && this.data.chapterList) {
            this.chapterList = this.data.chapterList;
            if (this.data.id) {
                this.chapterList.forEach((element) => {
                    if (element.id === this.data.chapterMasterId) {
                        this.selectedChapter = element;
                    }
                });
                this.parentClassList.forEach((element) => {
                    if (
                        this.data.parentClassIds.includes(
                            element.parent_class_id
                        )
                    ) {
                        this.selectedClasses.push(element);
                    }
                });
            } else {
                this.selectedChapter = this.chapterList.filter(
                    (chapter) => chapter.title === 'General'
                )[0];
            }
        }
    }

    createAddPracticeForm = () => {
        this.addPracticeForm = this.createForm({
            practice_name: [
                this.data.name ? this.data.name : '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(255)
                ]
            ],
            maximum_question: [
                this.data.maxQuestion ? this.data.maxQuestion : '',
                [
                    Validators.required,
                    Validators.min(1),
                    Validators.minLength(1),
                    Validators.maxLength(3),
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            chapterMasterId: [],
            parentClassIds: [],
            description: [
                this.data.description ? this.data.description : '',
                [Validators.minLength(2), Validators.maxLength(500)]
            ]
        });
    };

    addPractice = (params) => {
        return this.practiceService.addPractice(params);
    };

    updatePractice = (params, practiceId) => {
        return this.practiceService.updatePractice(params, practiceId);
    };

    onAddPracticeFormSubmit = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            if (this.selectedFolderList.length) {
                const params = {
                    chapterIds: this.selectedFolderList.map(
                        (element) => element.id
                    ),
                    description: form.value.description,
                    gradeId: this.data.grade_id,
                    maxQuestion: form.value.maximum_question,
                    name: form.value.practice_name,
                    subjectId: this.data.subject_id,
                    chapterMasterId: form.value.chapterMasterId
                        ? form.value.chapterMasterId.id
                        : '',
                    parentClassIds: form.value.parentClassIds.length
                        ? form.value.parentClassIds.map(
                              (parentClass) => parentClass.parent_class_id
                          )
                        : []
                };
                if (this.data.id) {
                    this.updatePractice(params, this.data.id).subscribe(
                        (response) => {
                            this.onCloseDialog(true);
                        }
                    );
                } else {
                    this.addPractice(params).subscribe((response) => {
                        this.onCloseDialog(false);
                        let practice = response.payload;
                        practice['chapters'] = this.selectedFolderList;
                        this.selectedGradeAndSubject['practiceDetails'] = {
                            ...practice
                        };
                        this.practiceService.setPracticeFilterData(
                            this.selectedGradeAndSubject
                        );
                        this.router.navigate([
                            '/' + RouteConstant.QUESTION_SELECT_PRACTICE
                        ]);
                    });
                }
            } else {
                this.sharedService.setSnackBar('Please select folder');
            }
        }
    };

    onCloseDialog(flag) {
        this.dialogRef.close(flag);
    }

    onQuestionBankDialogOpen = () => {
        this.data['chapters'] = this.selectedFolderList;
        const dialogRef = this.dialog.open(
            SelectQuestionBankPracticeDialogComponent,
            {
                panelClass: 'question-bank-dialog-container',
                data: this.data
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.selectedFolderList = result;
            }
        });
    };

    onSelectChangeEvent = (event, type) => {
        if (type === 'chapterMasterId') {
            this.formControls[type].setValue(event);
        }
    };

    onSelectClassChangeEvent = (event, type) => {
        if (type === 'classMasterId') {
            this.formControls[type].setValue(event);
        }
        if (type === 'parentClassIds') {
            this.formControls[type].setValue(event);
        }
    };

    removeChapter = (chapter) => {
        this.selectedFolderList = this.selectedFolderList.filter(
            (item) => item.id !== chapter.id
        );
    };

    // Helpers
    get formControls() {
        return this.addPracticeForm.controls;
    }
}
