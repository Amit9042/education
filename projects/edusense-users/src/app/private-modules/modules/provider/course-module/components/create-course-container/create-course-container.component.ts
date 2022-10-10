import { Component, OnInit } from '@angular/core';
import { SharedService } from '@sharedModule/services';
import { ActivatedRoute } from '@angular/router';
import { CourseModel, EnrolledStudentsModel, LanguageModel } from '../../models';
import { CourseService } from '../../services';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

enum Views {
    OVERVIEW,
    CONTENT,
    ADDITIONAL_INFO,
    PREVIEW,
    ENROLLMENT_COURSE,
    ENROLLMENT_STUDENT
}

@Component({
    selector: 'es-user-create-course-container',
    templateUrl: './create-course-container.component.html',
    styleUrls: ['./create-course-container.component.scss']
})
export class CreateCourseContainerComponent implements OnInit {
    // Constant variables
    htmlView = Views;
    activeView: Views = this.htmlView.OVERVIEW;
    courseId: number;
    enrolledStudentData: EnrolledStudentsModel;

    // Data variables
    courseDetails: CourseModel;
    courseTitleFormControl = new FormControl();
    languageList: LanguageModel[] = [];

    // State variable
    visibleTitleField = true;

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.courseId = +params['params']['id'];
        });
        this.getInitialData();
    }

    // Initialisation methods
    getInitialData = () => {
        forkJoin(
            this.getCourseDetailsApiCall(),
            this.languageListApiCall()
        ).subscribe(allResponse => {
            this.courseDetails = allResponse[0]['payload']['course'];
            this.courseTitleFormControl.setValue(this.courseDetails.title);
            this.languageList = allResponse[1]['payload']['languages'];
        });
    };

    // API Call
    getCourseDetailsApiCall = () => {
        return this.courseService.getCourseDetails(this.courseId);
    };

    updateCourseApiCall = (params: any) => {
        return this.courseService.updateCourse(this.courseId, params);
    };

    languageListApiCall = () => {
        return this.courseService.getLanguageList({
            rowNumber: 1,
            recordsPerPage: 1000,
            sortOrder: 'asc',
            sortBy: 'name'
        });
    };

    // Page events
    getCourseDetails = () => {
        this.getCourseDetailsApiCall().subscribe(response => {
            this.courseDetails = response['payload']['course'];
            this.courseTitleFormControl.setValue(this.courseDetails.title);
        });
    };

    onSaveTitle = () => {
        this.updateCourseApiCall({
            title: this.courseTitleFormControl.value
        }).subscribe(response => {
            this.getCourseDetails();
            this.onCloseTitle();
        });
    };

    onChangeView(flag) {
        switch (flag) {
            case 'overview':
                this.activeView = this.htmlView.OVERVIEW;
                break;

            case 'content':
                this.activeView = this.htmlView.CONTENT;
                break;

            case 'additional-info':
                this.activeView = this.htmlView.ADDITIONAL_INFO;
                break;

            case 'preview':
                this.activeView = this.htmlView.PREVIEW;
                break;

            case 'enrollment-course':
                this.activeView = this.htmlView.ENROLLMENT_COURSE;
                break;

            case 'enrollment-student':
                this.activeView = this.htmlView.ENROLLMENT_STUDENT;
                break;
        }
    }

    onEditTitleName() {
        this.visibleTitleField = false;
    }

    onCloseTitle() {
        this.courseTitleFormControl.setValue(this.courseDetails.title);
        this.visibleTitleField = true;
    }

    getUserData = (data: EnrolledStudentsModel) => {
        this.enrolledStudentData = data;
    };
}
