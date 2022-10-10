import { Injectable } from '@angular/core';
import { EnterpriseDetail } from '../../../../../public-modules/models';
import { StudentPracticeService } from '../services';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OperatorEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class PracticeChapterResolverService {
    // Data variables
    activeEnterprise: EnterpriseDetail;
    userDetails: any;
    rowNumber = 1;
    recordsPerPage = 4;
    subjectId: number;
    gradeId: number;

    constructor(
        private studentPracticeService: StudentPracticeService,
        private sharedUserService: SharedUserService,
        private sharedService: SharedService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.subjectId = +route.paramMap.get('id');
        this.userDetails = this.sharedUserService.getUser();
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        this.gradeId = +this.sharedService.getUserConfig()['studentObj'][
            'grade_id'
        ];
        return forkJoin(
            this.studentPracticeService.getPracticeChapterList(
                {
                    criteria: [
                        {
                            column: 'subjectId',
                            operator: OperatorEnum.EQUALS,
                            values: [this.subjectId]
                        },
                        {
                            column: 'gradeId',
                            operator: OperatorEnum.EQUALS,
                            values: [this.gradeId]
                        }
                    ],
                    limit: 100000,
                    offset: 0
                },
                this.activeEnterprise.provider_uuid
            ),
            this.studentPracticeService.getPracticeList(
                {
                    gradeId: this.userDetails.grade_id,
                    subjectId: this.subjectId,
                    offset: this.rowNumber - 1,
                    limit: this.recordsPerPage
                },
                this.activeEnterprise.provider_uuid
            )
        ).pipe(
            map(
                (allResponse) => {
                    return {
                        chapterList: allResponse[0]['payload']['content'],
                        practiceList: allResponse[1]['payload']['content']
                    };
                },
                catchError((error) => this.handleError(error))
            )
        );
    }

    // helper methods
    private handleError(error) {
        return of(error);
    }
}
