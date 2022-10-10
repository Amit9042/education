import { Component, OnInit } from '@angular/core';
import { FormBaseComponent } from '@sharedModule/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationConstant, CommonRegexp } from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-email-dialog',
    templateUrl: './edit-email-dialog.component.html',
    styleUrls: ['./edit-email-dialog.component.scss']
})
export class EditEmailDialogComponent extends FormBaseComponent
    implements OnInit {
    // Form group variables
    editEmailForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(
        fb: FormBuilder,
        public dialog: MatDialog // public dialogRef: MatDialogRef<EditEmailDialogComponent>
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.createEditEmailForm();
    }

    createEditEmailForm() {
        this.editEmailForm = this.createForm({
            email: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(255),
                    Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
                ]
            ]
        });
    }

    // openEditEmailDialog(): void {
    //   const dialogRef = this.dialog.open(EditEmailDialogComponent, {
    //     panelClass: "dialog-container",
    //     data: {}
    //   });

    //   dialogRef.afterClosed().subscribe(result => {});
    // }

    // Events
    onSubmitEditEmailForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            // this.router.navigate(["/" + RouteConstant.LOGIN]);
            // //   this.authenticationService.signup(form.value).subscribe(response => {});
        }
    };

    onCloseDialog(): void {
        // this.dialogRef.close();
    }

    openEmailOtpDialog() {
        // const dialogRef = this.dialog.open(EmailOtpDialogComponent, {
        //   panelClass: "dialog-container",
        //   data: {}
        // });
        // dialogRef.afterClosed().subscribe(result => {});
    }

    // Helpers
    get formControls() {
        return this.editEmailForm.controls;
    }
}
