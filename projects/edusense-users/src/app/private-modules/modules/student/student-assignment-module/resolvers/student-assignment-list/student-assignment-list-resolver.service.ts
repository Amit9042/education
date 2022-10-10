import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StudentAssignmentService } from '../../services';
import * as moment from 'moment';
import { SharedService } from '@sharedModule/services';
import {
    AssignmentRedirect,
    PAGE_SIZE_OPTIONS,
    SortingEnum
} from '@sharedModule/constants';
import { getQueryParams } from '@sharedModule/functions';
import { EnterpriseDetail } from '../../../../../../public-modules/models';

@Injectable({
    providedIn: 'root'
})
export class StudentAssignmentListResolverService {
    // Data variables
    currentDate = new Date();
    activeEnterprise: EnterpriseDetail;

    // Pagination related variables
    recordsPerPage = PAGE_SIZE_OPTIONS[0];
    rowNumber = 1;

    constructor(
        private router: Router,
        private studentAssignmentService: StudentAssignmentService,
        private sharedService: SharedService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        return this.studentAssignmentService
            .getStudentAssignmentList(
                this.getParams(),
                this.activeEnterprise.provider_uuid
            )
            .pipe(
                map(
                    response => {
                        return {
                            studentAssignmentList: response['payload']
                        };
                    },
                    catchError(error => this.handleError(error))
                )
            );
    }

    getParams = () => {
        let params;
        let redirectedDate = this.sharedService.getDateForAssignmentRedirection();
        if (redirectedDate) {
            if (redirectedDate === AssignmentRedirect.All_ASSIGNMENT) {
                params = getQueryParams(
                    {},
                    {
                        active: 'startDate',
                        direction: SortingEnum.DESCENDING
                    },
                    this.rowNumber,
                    this.recordsPerPage
                );
            } else {
                params = {
                    showAll: true,
                    date: redirectedDate
                };
            }
        } else {
            params = {
                showAll: true,
                date: moment(this.currentDate).format('YYYY-MM-DD')
            };
        }
        return params;
    };

    // helper methods
    private handleError(error) {
        return of(error);
    }
}
