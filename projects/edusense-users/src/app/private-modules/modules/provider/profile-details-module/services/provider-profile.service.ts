import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class ProviderProfileService {
    constructor(private apiManager: APIManager) {}

    getPoviderDetail = (providerId: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.GET_PROVIDER_DETAIL}/${providerId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            false
        );
    };

    updateProviderProfile = (params, fileObj = []): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.UPDADTE_PROVIDER_PROFILE,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true,
            {},
            fileObj
        );
    };

    getProviderTypeList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PROVIDER_TYPE_LIST,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    getGradeList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.GRADE_LIST,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    getBoardList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.BOARD_LIST,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    getMediumList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.MEDIUM_LIST,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    getSubjectList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.SUBJECT_LIST,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    getCountryList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.COUNTRY_LIST,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            false
        );
    };

    updateProviderOtherProfile = (params, fileObj = []): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.UPDADTE_PROVIDER_USER_PROFILE,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true,
            {},
            fileObj
        );
    };
}
