import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AssignmentDetailModel,
    SubmittedAssignmentModel
} from '@sharedModule/models';
import { RouteConstant } from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-assignment-completed-view',
    templateUrl: './assignment-completed-view.component.html',
    styleUrls: ['./assignment-completed-view.component.scss']
})
export class AssignmentCompletedViewComponent implements OnInit, OnDestroy {
    // Data variables
    assignmentDetail: AssignmentDetailModel;
    submissionDetail: SubmittedAssignmentModel;

    constructor(
        private location: Location,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.routeSubscriber();
    }

    ngOnDestroy() {
        this.sharedService.setAssignmentRedirectionData('');
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.assignmentDetail) {
                this.assignmentDetail = resolvedData.assignmentDetail;
            }
            if (resolvedData.submissionDetail) {
                this.submissionDetail = resolvedData.submissionDetail;
            }
        });
    };

    // Page events
    onBack() {
        let redirectData = this.sharedService.getAssignmentRedirectionData();
        this.sharedService.setDateForAssignmentRedirection(redirectData);
        this.router.navigate([
            '/' + RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE
        ]);
    }
}
