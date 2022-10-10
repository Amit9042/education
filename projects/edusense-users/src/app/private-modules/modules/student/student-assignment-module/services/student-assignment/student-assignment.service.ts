import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class StudentAssignmentService {
    constructor(private apiManager: APIManager) {}

    getStudentAssignmentList = (
        params: any,
        providerUUID: string
    ): Observable<any> => {
        const endPoint = providerUUID
            ? `${ApplicationApi.STUDENT_ASSIGNMENT_LIST_V2}?providerUUID=${providerUUID}`
            : `${ApplicationApi.STUDENT_ASSIGNMENT_LIST_V2}`;
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            endPoint,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getStudentAssignmentDetails = (
        id: string,
        providerUUID: string
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.STUDENT_ASSIGNMENT_V2}/${id}?providerUUID=${providerUUID}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getStudentSubmissionDetails = (id: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.STUDENT_SUBMISSION}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    uploadSubmissionFile = (fileObj: any[] = []): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.STUDENT_ASSIGNMENT_FILE,
            {},
            this.apiManager.authorisedHttpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    removeSubmissionFile = (id: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.STUDENT_ASSIGNMENT_FILE}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    submitAssignment = (params: any, providerUUID: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.STUDENT_ASSIGNMENT_V2}?providerUUID=${providerUUID}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
}
