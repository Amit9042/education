import { Injectable } from '@angular/core';
import { APIManager, SharedService } from '@sharedModule/services';
import { Observable } from 'rxjs/internal/Observable';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class StudentAutenticationService {
    constructor(
        private apiManager: APIManager,
        private sharedService: SharedService
    ) {}

    login(params): Observable<any> {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_LOGIN,
            params,
            this.apiManager.Content_Type_HttpOptions,
            true,
            true
        );
    }

    getUserDetails = (userId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.GET_STUDENT_PROFILE}/${userId}`,
            {},
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    logout(): Observable<any> {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.LOGOUT,
            {},
            this.apiManager.authorisedHttpOptions,
            true,
            true
        );
    }

    changeStudentPassword = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.CHANGE_STUDENT_PASSWORD,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true
        );
    };

    getStudentConfig = (): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.STUDENT_CONFIG,
            {},
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    getStudentContryFromIP = (): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.STUDENT_COUNTRY,
            {},
            this.apiManager.Content_Type_HttpOptions,
            false,
            false
        );
    };

    getStudentCountryList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_COUNTRY_LIST,
            params,
            this.apiManager.Content_Type_HttpOptions,
            false,
            true
        );
    };
}
