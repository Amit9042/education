import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnrolledStudentCourseDetailModel, EnrolledStudentsModel } from '../../../../models';
import { StudentEnrollService } from '../../../../../../../services';

@Component({
    selector: 'es-user-enrollment-student-details',
    templateUrl: './enrollment-student-details.component.html',
    styleUrls: ['./enrollment-student-details.component.scss']
})
export class EnrollmentStudentDetailsComponent implements OnInit {
    // Angular variables
    @Output() onChangeStep = new EventEmitter();
    @Input() studentData: EnrolledStudentsModel;

    // Data variables
    lectureDetails: EnrolledStudentCourseDetailModel;
    parentIndex;
    currentIndex;

    constructor(private studentEnrollService: StudentEnrollService) {}

    ngOnInit(): void {
        this.getEnrolledStudentCourseDetails();
    }

    // Initialisation methods
    getEnrolledStudentCourseDetails = () => {
        this.getEnrolledStudentCourseDataApiCall().subscribe(response => {
            this.lectureDetails = response['payload'];
        });
    };

    // Api calls
    getEnrolledStudentCourseDataApiCall = () => {
        return this.studentEnrollService.enrolledStudentsDetails(
            this.studentData.enrollment_id
        );
    };

    // Page events
    onEnrollmentCourseOpen = () => {
        this.onChangeStep.emit('enrollment-course');
    };
}
