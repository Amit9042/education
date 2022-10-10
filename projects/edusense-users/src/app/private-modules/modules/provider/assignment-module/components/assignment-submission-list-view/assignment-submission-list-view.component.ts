import { Component, Input, OnInit } from '@angular/core';
import { RouteConstant, ViewType } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { AssignmentSubmissionModel } from '../../models';

@Component({
    selector: 'es-user-assignment-submission-list-view',
    templateUrl: './assignment-submission-list-view.component.html',
    styleUrls: ['./assignment-submission-list-view.component.scss']
})
export class AssignmentSubmissionListViewComponent implements OnInit {
    // Angular variables
    @Input() submissionList: AssignmentSubmissionModel[] = [];

    // view type
    viewType = ViewType;
    currentViewType = ViewType.Data;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    onAssignmentSubmissionView(submission: AssignmentSubmissionModel) {
        if (!!submission.student_assignment) {
            this.router.navigate([
                '/' + RouteConstant.ASSIGNMENT_SUBMISSION_VIEW,
                submission.student_assignment.student_assignment_id
            ]);
        }
    }
}
