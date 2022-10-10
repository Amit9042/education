import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentSubmissionModel } from '../../models';
import { AssignmentDetailModel } from '@sharedModule/models';

@Component({
    selector: 'es-user-assignment-view',
    templateUrl: './assignment-view.component.html',
    styleUrls: ['./assignment-view.component.scss']
})
export class AssignmentViewComponent implements OnInit {
    // Data variables
    assignmentDetails: AssignmentDetailModel;
    submissionList: AssignmentSubmissionModel[] = [];

    constructor(
        private location: Location,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.routeSubscriber();
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.assignmentDetails) {
                this.assignmentDetails = resolvedData.assignmentDetails;
            }
            if (resolvedData.submissionList) {
                this.submissionList = resolvedData.submissionList;
            }
        });
    };

    onBack() {
        this.location.back();
    }
}
