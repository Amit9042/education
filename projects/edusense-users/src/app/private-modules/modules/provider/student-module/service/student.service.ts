import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    constructor(private apiManager: APIManager) {}

    listStudent = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUD_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getDetails = (param,id): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUD_DETAILS + '/' + id,
            param,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeStudent = (params, id): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUD_REMOVE + '/' + id,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
}
