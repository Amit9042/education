import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class StudentClassesService {
    constructor(private apiManager: APIManager) {}

    classList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_CLASS_LIST_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    joinClass = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_JOIN_CLASS_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    leaveClass = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_LEAVE_CLASS_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getClassDetails = (params, id: string): Observable<any> => {
        const endPoint = ApplicationApi.STUDENT_CLASS_DETAILS_V2 + '/' + id;
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            endPoint,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
