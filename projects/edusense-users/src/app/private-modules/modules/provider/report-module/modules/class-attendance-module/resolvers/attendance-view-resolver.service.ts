import { Injectable } from '@angular/core';
import { RouteConstant } from '@sharedModule/constants';
import { ClassAttendanceService } from '../services';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AttendanceViewResolverService {
    // Data variables
    sessionId: string;

    constructor(
        private classAttendanceService: ClassAttendanceService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.sessionId = route.paramMap.get('id');
        return this.classAttendanceService
            .getAttendanceDetails(this.sessionId)
            .pipe(
                map(
                    response => {
                        return {
                            attendanceDetails: response['payload']['data']
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
