import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { ValidationConstant } from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { Router } from '@angular/router';
import { QuestionBankService } from '../../service';

@Component({
    selector: 'es-user-add-chapter-dialog',
    templateUrl: './add-chapter-dialog.component.html',
    styleUrls: ['./add-chapter-dialog.component.scss']
})
export class AddChapterDialogComponent
    extends FormBaseComponent
    implements OnInit {
    // Form group variables
    myControl = new FormControl();
    addChapterForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // State variables
    isLoadingResults = false;

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<AddChapterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private questionBankService: QuestionBankService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.initialize();
    }

    initialize = () => {
        this.createAddChapterForm();
    };

    createAddChapterForm = () => {
        this.addChapterForm = this.createForm({
            chTitle: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(255)
                ]
            ],
            description: [
                '',
                [Validators.minLength(2), Validators.maxLength(500)]
            ]
        });
    };

    //Api calls
    addChaper = (params) => {
        return this.questionBankService.addQuizChaper(params);
    };

    onSubmitAddChapterForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            this.isLoadingResults = true;
            const params = {
                description: form.value.description,
                gradeId: this.data.grade_id,
                subjectId: this.data.subject_id,
                title: form.value.chTitle
            };
            this.addChaper(params).subscribe((res) => {
                this.onCloseDialog(res.payload);
            });
        }
    };

    onCloseDialog(flag: boolean) {
        this.dialogRef.close(flag);
    }

    // Helpers
    get formControls() {
        return this.addChapterForm.controls;
    }
}
