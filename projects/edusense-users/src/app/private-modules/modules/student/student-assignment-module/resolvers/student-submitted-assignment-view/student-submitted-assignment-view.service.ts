import { Injectable } from '@angular/core';
import { StudentAssignmentService } from '../../services';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnterpriseDetail } from '../../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class StudentSubmittedAssignmentViewService {
    // Data variables
    assignmentId: string;
    submissionId: string;
    activeEnterprise: EnterpriseDetail;

    constructor(
        private studentAssignmentService: StudentAssignmentService,
        private sharedService: SharedService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.assignmentId = route.paramMap.get('aId');
        this.submissionId = route.paramMap.get('sId');
        this.activeEnterprise = this.sharedService.getActiveEnterprise();

        return forkJoin(
            this.studentAssignmentService.getStudentAssignmentDetails(
                this.assignmentId,
                this.activeEnterprise.provider_uuid
            ),
            this.studentAssignmentService.getStudentSubmissionDetails(
                this.submissionId
            )
        ).pipe(
            map(
                allResponse => {
                    return {
                        assignmentDetail: allResponse[0]['payload']['data'],
                        submissionDetail: allResponse[1]['payload']['data']
                    };
                },
                catchError(error => this.handleError(error))
            )
        );
    }

    // helper methods
    private handleError(error) {
        return of(error);
    }
}
