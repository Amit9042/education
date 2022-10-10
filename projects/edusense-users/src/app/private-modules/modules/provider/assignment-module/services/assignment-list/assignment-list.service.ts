import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class AssignmentListService {
    constructor(private apiManager: APIManager) {}

    getAssignmentList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ASSIGNMENT_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    createAssignment = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ASSIGNMENT_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    updateAssignment = (id: number, params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.ASSIGNMENT}/${id}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    uploadAssignmentFile = (fileObj: any[] = []): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.ASSIGNMENT_FILE,
            {},
            this.apiManager.authorisedHttpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    removeAssignmentFile = (id: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.ASSIGNMENT_FILE}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
