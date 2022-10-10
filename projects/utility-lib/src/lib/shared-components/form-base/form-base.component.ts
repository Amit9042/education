import {
    FormBuilder,
    FormControl,
    FormControlDirective,
    FormControlName,
    FormGroup
} from '@angular/forms';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'app-form-base',
    template: ''
})
export class FormBaseComponent implements OnChanges {
    @Input() canFocusField: boolean;
    @ViewChild('initialFormField', { static: true }) initialFormField;

    submitted = false;

    constructor(protected fb: FormBuilder) {}

    ngOnChanges() {
        if (this.initialFormField && this.canFocusField) {
            this.initialFormField.nativeElement.focus();
        }
    }

    /**
     *
     */
    protected createForm(controlsConfig, extraConfig = {}): FormGroup {
        const form = this.fb.group(controlsConfig, extraConfig);
        this.initializeFormFocus();
        return form;
    }

    /**
     *  Initialization methods for form focus
     */
    private initializeFormFocus() {
        const originFormControlNgOnChanges =
            FormControlDirective.prototype.ngOnChanges;
        FormControlDirective.prototype.ngOnChanges = function() {
            const elementRef =
                this.valueAccessor._elementRef || this.valueAccessor._element;
            if (elementRef && elementRef.nativeElement) {
                this.form.nativeElement = elementRef.nativeElement;
            }
            return originFormControlNgOnChanges.apply(this, arguments);
        };

        const originFormControlNameNgOnChanges =
            FormControlName.prototype.ngOnChanges;
        FormControlName.prototype.ngOnChanges = function() {
            const result = originFormControlNameNgOnChanges.apply(
                this,
                arguments
            );
            this.control.nativeElement = this.valueAccessor._elementRef
                ? this.valueAccessor._elementRef.nativeElement
                : null;
            return result;
        };
    }

    /**
     * On Submit form check validation method
     * @param formName
     * @param formControls
     */
    protected onCheckValidation(formName) {
        this.focusSetOnInvalidControls(formName);
        this.controlForLoops(formName);
    }

    protected onSubmit(form) {
        this.submitted = true;
        if (form.invalid) {
            this.onCheckValidation(form);
            return false;
        }
        return true;
    }

    /**
     * @param formName
     * @param formControls
     */
    controlForLoops = formName => {
        for (const field in formName.controls) {
            const control = formName.get(field);
            if (control.invalid) {
                control.markAsTouched({ onlySelf: true });
                break;
            }
        }
        return;
    };

    /**
     * Focus set on first invalid controls while click on submit event
     * @param formName
     */
    focusSetOnInvalidControls = formName => {
        const invalid = <FormControl[]>Object.keys(formName.controls)
            .map(key => formName.controls[key])
            .filter(ctl => ctl.invalid);

        if (invalid.length > 0) {
            for (let i = 0; i < invalid.length; i++) {
                invalid[i].markAsUntouched({ onlySelf: true });
            }
            const invalidElem: any = invalid[0];
            if (invalidElem.nativeElement) {
                invalidElem.nativeElement.focus();
            }
        }
    };

    /**
     * Form Field Blur method
     * @param formName
     * @param formControls
     */
    onBlur = formName => {
        for (const field in formName.controls) {
            const control = formName.get(field);
            control.markAsUntouched({ onlySelf: true });
        }
        return;
    };

    /**
     * @param formControlName(Required Field)
     */
    isRequiredField = formControlName => {
        return formControlName.touched && formControlName.hasError('required');
    };

    /**
     * @param formControlName(Valid field)
     */
    isValidField = formControlName => {
        return formControlName.touched && formControlName.hasError('pattern');
    };

    isInvalidDateField = formControlName => {
        return formControlName.touched && formControlName.invalid;
    };

    getDatePickerErrors = ctrl => {
        if (Object.keys(ctrl.errors).length === 1) {
            return Object.keys(ctrl.errors)[0];
        } else {
            return Object.keys(ctrl.errors)[2];
        }
    };

    /**
     * @param formControlName(Valid Length)
     */
    isValidLength = formControlName => {
        return (
            formControlName.touched &&
            (formControlName.hasError('minlength') ||
                formControlName.hasError('maxlength'))
        );
    };

    /**
     * @param formControlName
     */
    isValidNumber = formControlName => {
        return (
            formControlName.touched &&
            (formControlName.hasError('min') || formControlName.hasError('max'))
        );
    };

    /**
     * @param errorName
     * @param formGroup
     * @param formControl
     * @param submitted
     * Custom Validation method
     */
    hasError = (errorName, formGroup, formControl, submitted) => {
        return submitted && formGroup.hasError(errorName) && formControl.dirty;
    };
}
