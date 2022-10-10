import { Injectable } from '@angular/core';
import { StudentPracticeService } from '../services';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnterpriseDetail } from '../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class StudentBookmarkQuestionResolverService {
    // Data variables
    practiceId: number;
    activeEnterprise: EnterpriseDetail;

    constructor(
        private studentPracticeService: StudentPracticeService,
        private sharedService: SharedService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        return this.studentPracticeService
            .getBookmarkPracticeList({
                providerUUID: this.activeEnterprise.provider_uuid
            })
            .pipe(
                map(
                    response => {
                        return {
                            bookmarkedPracticeList: response['payload']
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
