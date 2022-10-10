import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBaseComponent } from '@sharedModule/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationConstant, CommonRegexp } from '@sharedModule/constants';
// import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-email-otp-dialog',
    templateUrl: './email-otp-dialog.component.html',
    styleUrls: ['./email-otp-dialog.component.scss']
})
export class EmailOtpDialogComponent extends FormBaseComponent
    implements OnInit {
    // Angular variables
    @ViewChild('inputRef1', { static: true }) inputRef1;
    @ViewChild('inputRef2', { static: true }) inputRef2;
    @ViewChild('inputRef3', { static: true }) inputRef3;
    @ViewChild('inputRef4', { static: true }) inputRef4;
    @ViewChild('inputRef5', { static: true }) inputRef5;
    @ViewChild('inputRef6', { static: true }) inputRef6;

    // Form group variables
    emailOtpForm: FormGroup;

    // Constants variables
    validationMsg = new ValidationConstant();

    constructor(
        fb: FormBuilder
        // public dialogRef: MatDialogRef<EmailOtpDialogComponent>
    ) {
        super(fb);
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.createEmailOtpForm();
    }

    createEmailOtpForm() {
        this.emailOtpForm = this.createForm({
            otpInput1: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput2: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput3: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput4: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ],
            otpInput5: [
                '',
                [
                    Validators.required as any,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP) as any
                ]
            ],
            otpInput6: [
                '',
                [
                    Validators.required,
                    Validators.pattern(CommonRegexp.NUMERIC_REGEXP)
                ]
            ]
        });
    }

    onPasteEvent(event) {
        // const clipboardData = event.clipboardData; // || window.clipboardData
        // const pastedText = clipboardData.getData("text");
        // const arry = pastedText.split("");
        // for (let i = 0; i < arry.length; i++) {
        //   this.otpForm.get("otpInput" + (i + 1)).setValue(arry[i]);
        // }
        // this.inputRef6.nativeElement.focus();
    }

    onFocus(currentRef) {
        const originalValue = currentRef.value;
        currentRef.value = '';
        currentRef.blur();
        currentRef.focus();
        currentRef.value = originalValue;
    }

    onBlurInput(event, currentRef, nextRef) {
        if (event.keyCode === 16) {
            event.preventDefault();
        } else if (
            event.keyCode === 37 ||
            event.keyCode === 38 ||
            event.keyCode === 39 ||
            event.keyCode === 40
        ) {
            this.onFocus(currentRef);
        } else {
            if (nextRef) {
                setTimeout(() => {
                    nextRef.focus();
                }, 1);
            }
        }
    }

    // Events
    onSubmitEmailOtpForm = (form: FormGroup) => {
        if (this.onSubmit(form)) {
            // this.router.navigate(["/" + RouteConstant.LOGIN]);
            // //   this.authenticationService.signup(form.value).subscribe(response => {});
        }
    };

    onCloseDialog(): void {
        // this.dialogRef.close();
    }

    // Helpers
    get formControls() {
        return this.emailOtpForm.controls;
    }
}
