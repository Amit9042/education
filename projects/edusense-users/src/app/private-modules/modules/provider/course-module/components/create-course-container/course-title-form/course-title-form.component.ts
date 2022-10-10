import { RouteConstant, ValidationConstant } from '@sharedModule/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBaseComponent } from '@sharedModule/components';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services';
import { removeEmptyFields } from '@sharedModule/functions';

@Component({
    selector: 'es-user-course-title-form',
    templateUrl: './course-title-form.component.html',
    styleUrls: ['./course-title-form.component.scss']
})
export class CourseTitleFormComponent extends FormBaseComponent
    implements OnInit {
    // Validation Constant
    validationConstant = new ValidationConstant();

    // Form variables
    courseTitleForm: FormGroup;

    // State variables
    isLoading = false;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private courseService: CourseService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.createCourseForm();
    }

    // Initialisation methods
    createCourseForm() {
        this.courseTitleForm = this.createForm({
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100)
                ]
            ]
        });
    }

    // Api Calls
    addCourseApiCall = (params: any) => {
        return this.courseService.createCourse(params);
    };

    // Page events
    onSubmitCourseForm(form: FormGroup) {
        if (this.onSubmit(form)) {
            let params = removeEmptyFields(form.value);
            this.isLoading = true;
            this.addCourseApiCall(params).subscribe(
                response => {
                    this.isLoading = false;
                    this.router.navigate([
                        '/' + RouteConstant.CREATE_COURSE,
                        response['payload']['course']['course_id']
                    ]);
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    onCourseList = () => {
        this.router.navigate(['/' + RouteConstant.COURSE_LIST]);
    };

    get formControls() {
        return this.courseTitleForm.controls;
    }
}
