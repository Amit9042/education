import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RouteConstant, SortingEnum } from '@sharedModule/constants';
import { AssignmentViewService } from '../services';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AssignmentViewResolverService {
    // Data variables
    assignmentId: string;

    constructor(
        private assignmentViewService: AssignmentViewService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.assignmentId = route.paramMap.get('id');
        return forkJoin(
            this.assignmentViewService.getAssignmentDetails(this.assignmentId),
            this.assignmentViewService.getAssignmentSubmissionList({
                assignmentId: this.assignmentId,
                showAll: true,
                sortBy: 'submissionDate',
                sortOrder: SortingEnum.DESCENDING
            })
        ).pipe(
            map(
                allResponse => {
                    return {
                        assignmentDetails: allResponse[0]['payload']['data'],
                        submissionList: allResponse[1]['payload']
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
