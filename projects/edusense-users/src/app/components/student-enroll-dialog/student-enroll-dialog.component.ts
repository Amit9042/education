import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationConstant } from '@sharedModule/constants';
import { FormBaseComponent } from '@sharedModule/components';
import { StudentEnrollService } from '../../private-modules/services';
import { ProviderModel } from '../../private-modules/models';

@Component({
    selector: 'app-student-enroll-dialog',
    templateUrl: './student-enroll-dialog.component.html',
    styleUrls: ['./student-enroll-dialog.component.scss']
})
export class StudentEnrollDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form group variables
    studentEnrollForm: FormGroup;
    providerDetails: ProviderModel;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(
        fb: FormBuilder,
        protected studentEnrollService: StudentEnrollService,
        public dialogRef: MatDialogRef<StudentEnrollDialogComponent>
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize = () => {
        this.createStudentEnrollForm();
    };

    createStudentEnrollForm = () => {
        this.studentEnrollForm = this.createForm({
            code: ['', [Validators.required]]
        });
    };

    // Events
    onSubmitStudentEnrollForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            const code = form.value.code;
            this.studentEnrollService
                .searchProvider(code)
                .subscribe((response) => {
                    this.providerDetails = response.payload;
                });
        }
    };

    onEnroll() {
        const params = { provider_id: this.providerDetails.provider_id };
        this.studentEnrollService.enroll(params).subscribe(
            (response) => {
                this.onCloseDialog();
            },
            (error) => console.error(error)
        );
    }

    onCloseDialog() {
        this.dialogRef.close();
    }

    // Helpers
    get formControls() {
        return this.studentEnrollForm.controls;
    }
}
