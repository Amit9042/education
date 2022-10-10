import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class AssignmentViewService {
    constructor(private apiManager: APIManager) {}

    getAssignmentDetails = (id): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.ASSIGNMENT}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getAssignmentSubmissionList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ASSIGNMENT_SUBMISSION_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getSubmittedAssignmentDetails = (id: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.ASSIGNMENT_SUBMISSION_LIST}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    gradeSubmittedAssignment = (id: string, params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.ASSIGNMENT_SUBMISSION_V2}/${id}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
}
