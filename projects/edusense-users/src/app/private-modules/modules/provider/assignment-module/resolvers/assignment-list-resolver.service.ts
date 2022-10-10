import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AssignmentListService } from '../services';
import { RouteConstant } from '@sharedModule/constants';
import { ClassesService } from '../../classes-module/service';
import { SharedService } from '@sharedModule/services';
import { getQueryParams } from '@sharedModule/functions';

@Injectable({
    providedIn: 'root'
})
export class AssignmentListResolverService {
    // Data variables
    providerId: number;

    constructor(
        private assignmentListService: AssignmentListService,
        private router: Router,
        private classesService: ClassesService,
        private sharedService: SharedService
    ) {}

    resolve(): Observable<any> {
        const config = this.sharedService.getUserConfig();
        this.providerId = config['provider_list'][0]['provider_id'];

        return this.classesService
            .listClass({
                provider_id: this.providerId,
                ...getQueryParams({ is_active: 1 }, null, 1, 100, true)
            })
            .pipe(
                map(
                    response => {
                        return {
                            classList: response['payload']
                        };
                    },
                    catchError(error => this.handleError(error))
                )
            );
    }

    // helper methods
    private handleError(error) {
        this.router.navigate([
            '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
        ]);
        return of(error);
    }
}
