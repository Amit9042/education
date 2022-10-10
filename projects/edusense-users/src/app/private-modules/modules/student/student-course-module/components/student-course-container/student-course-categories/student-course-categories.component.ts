import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'es-user-student-course-categories',
    templateUrl: './student-course-categories.component.html',
    styleUrls: ['./student-course-categories.component.scss']
})
export class StudentCourseCategoriesComponent implements OnInit {
    titleCtrl: FormControl = new FormControl('');
  languageCtrl: FormControl = new FormControl('1');
  durationCtrl: FormControl = new FormControl('1');
  categoryCtrl: FormControl = new FormControl('1');
  
    constructor(private router: Router) {}

    ngOnInit(): void {}

    onStudentCourseDeatilsOpen() {
        this.router.navigate([
            '/' + RouteConstant.STUDENT_COURSE_DETAILS_CONTAINER
        ]);
    }
}
