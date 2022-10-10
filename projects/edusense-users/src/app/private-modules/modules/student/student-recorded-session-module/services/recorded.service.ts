import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class RecordedService {
    constructor(private apiManager: APIManager) {}

    getRecordedList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUD_RECORDING_LIST_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
    
    getTeacherList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUD_RECORDING_TEACHER_LIST_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getRecordedDetail = (id,param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.STUD_RECORDING_DETAILS_V2 + '/' + id,
            param,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
    
    getSub = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.STUD_RECORDING_SUB_LIST_V2,
            param,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getRoles = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ROLE_LIST,
            param,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
