import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot } from '@angular/router';
import { StudentAssignmentService } from '../../services';
import { EnterpriseDetail } from '../../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class StudentAssignmentViewResolverService {
    // Data variables
    assignmentId: string;
    activeEnterprise: EnterpriseDetail;

    constructor(
        private studentAssignmentService: StudentAssignmentService,
        private sharedService: SharedService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.assignmentId = route.paramMap.get('aId');
        this.activeEnterprise = this.sharedService.getActiveEnterprise();

        return this.studentAssignmentService
            .getStudentAssignmentDetails(
                this.assignmentId,
                this.activeEnterprise.provider_uuid
            )
            .pipe(
                map(
                    response => {
                        return {
                            assignmentDetail: response['payload']['data']
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
