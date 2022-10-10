import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';

@Component({
    selector: 'es-user-student-business-courses',
    templateUrl: './student-business-courses.component.html',
    styleUrls: ['./student-business-courses.component.scss']
})
export class StudentBusinessCoursesComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    onSeeAllStudentCourses() {
        this.router.navigate(['/' + RouteConstant.STUDENT_COURSE_CONTAINER]);
    }
}


