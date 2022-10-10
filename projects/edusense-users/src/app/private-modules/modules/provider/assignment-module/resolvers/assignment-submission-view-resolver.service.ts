import { Injectable } from '@angular/core';
import { AssignmentViewService } from '../services';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RouteConstant } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class AssignmentSubmissionViewResolverService {
    // Data variables
    submissionId: string;

    constructor(
        private assignmentViewService: AssignmentViewService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.submissionId = route.paramMap.get('id');
        return this.assignmentViewService
            .getSubmittedAssignmentDetails(this.submissionId)
            .pipe(
                map(
                    response => {
                        return {
                            submissionAssignmentDetail:
                                response['payload']['data']
                        };
                    },
                    catchError(error => this.handleError(error))
                )
            );
    }

    // helper methods
    private handleError(error) {
        this.router.navigate(['/' + RouteConstant.ASSIGNMENT_LIST]);
        return of(error);
    }
}
