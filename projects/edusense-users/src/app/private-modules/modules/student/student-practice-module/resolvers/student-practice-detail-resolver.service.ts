import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StudentPracticeService } from '../services';
import { ActivatedRouteSnapshot } from '@angular/router';
import { EnterpriseDetail } from '../../../../../public-modules/models';
import { SharedService } from '@sharedModule/services';
import { AllDoubtService } from '../../student-doubts-module/services';

@Injectable({
    providedIn: 'root'
})
export class StudentPracticeDetailResolverService {
    // Data variables
    practiceId: number;
    activeEnterprise: EnterpriseDetail;

    constructor(
        private studentPracticeService: StudentPracticeService,
        private sharedService: SharedService,
        private allDoubtService: AllDoubtService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this.practiceId = route.params['id'];
        this.activeEnterprise = this.sharedService.getActiveEnterprise();
        const isPracticeView = this.studentPracticeService.getIsPracitceDetailView();
        return forkJoin(
            !isPracticeView ? this.studentPracticeService.getPracticeDetails(
                this.practiceId,
                this.activeEnterprise.provider_uuid
            ) : this.studentPracticeService.getPracticeDetailsForView(this.practiceId),
            this.studentPracticeService.getPracticeQuestions(
                this.practiceId,
                [],
                this.activeEnterprise.provider_uuid
            ),
            this.allDoubtService.getSubList({
                providerUUID: this.activeEnterprise.provider_uuid
            })
        ).pipe(
            map(
                allResponse => {
                    let array: any[] = allResponse[2]['payload'];
                    let subjectList = [];
                    array.forEach(subject => {
                        subject.class_subject_link.forEach(element => {
                            let subject: any = {};
                            subject['subject_id'] = element.subject_id;
                            subject['name'] = element.subject_master.name;
                            subject['description'] =
                                element.subject_master.description;
                            subject['logo'] = element.subject_master.logo;
                            subjectList.push(subject);
                        });
                    });
                    return {
                        practiceDetails: allResponse[0]['payload'],
                        studentQuestionList: allResponse[1]['payload'],
                        subjectList: subjectList
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
