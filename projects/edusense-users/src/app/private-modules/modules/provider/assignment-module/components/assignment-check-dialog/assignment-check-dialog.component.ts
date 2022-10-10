import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonRegexp, ValidationConstant } from '@sharedModule/constants';
import { removeEmptyFields } from '@sharedModule/functions';
import { AssignmentViewService } from '../../services';

@Component({
    selector: 'es-user-assignment-check-dialog',
    templateUrl: './assignment-check-dialog.component.html',
    styleUrls: ['./assignment-check-dialog.component.scss']
})
export class AssignmentCheckDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form group variables
    myControl = new FormControl();
    createAssignmentForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    // Data variables
    submissionId: string;

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<AssignmentCheckDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private assignmentViewService: AssignmentViewService
    ) {
        super(fb);
    }

    ngOnInit() {
        this.submissionId = this.data.submissionId;
        this.initialize();
    }

    initialize = () => {
        this.createCreateAssignmentForm();
        this.getPercentageEnableFlag();
    };

    createCreateAssignmentForm = () => {
        this.createAssignmentForm = this.createForm({
            action: ['1', Validators.required],
            completionPercentage: [
                { value: '', disabled: true },
                [
                    Validators.required,
                    Validators.min(1),
                    Validators.max(100),
                    Validators.pattern(CommonRegexp.PERCENTAGE_REGEXP)
                ]
            ],
            remarks: [
                '',
                [
                    Validators.minLength(2),
                    Validators.maxLength(1000),
                    Validators.pattern(
                        CommonRegexp.ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP
                    )
                ]
            ]
        });
    };

    getPercentageEnableFlag = () => {
        this.formControls['action'].valueChanges.subscribe((value) => {
            if (value !== '3') {
                this.formControls['completionPercentage'].disable();
            } else {
                this.formControls['completionPercentage'].enable();
            }
        });
    };

    // API calls
    gradeSubmittedAssignmentApiCall = (params: any) => {
        return this.assignmentViewService.gradeSubmittedAssignment(
            this.submissionId,
            params
        );
    };

    // Page events
    onSubmitCreateAssignmentForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            form.value['action'] = +form.value['action'];
            let params = removeEmptyFields(form.value);
            params['submissionId'] = this.submissionId;
            this.gradeSubmittedAssignmentApiCall(params).subscribe(
                (response) => {
                    this.onCloseDialog(true);
                }
            );
        }
    };

    onCloseDialog(flag = false) {
        this.dialogRef.close(flag);
    }

    // Helpers
    get formControls() {
        return this.createAssignmentForm.controls;
    }
}
