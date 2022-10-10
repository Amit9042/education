import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class StudentPracticeReportService {
    constructor(private apiManager: APIManager) {}

    getPracticeReportList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PRACTICE_REPORT,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeResult = (userId: number, practiceId: number) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.PRACTICE_RESULT}/${practiceId}/${userId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
