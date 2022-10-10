import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class StudentProfileService {
    constructor(private apiManager: APIManager) {}

    getProfileDetail = (userId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.GET_STUDENT_PROFILE}/${userId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            false
        );
    };

    updateProfileDetail = (params, fileObj = []): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            `${ApplicationApi.EDIT_STUDENT_PROFILE}`,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true,
            {},
            fileObj
        );
    };

    updateContactNumber = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.STUDENT_CHANGE_MOBILE,
            param,
            this.apiManager.authorisedHttpOptions,
            true,
            true
        );
    };

    resendOtp = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CHANGE_MOBILENO_RESEND_OTP,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    verifyContactNumber = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.STUDENT_CHANGE_CONTACT_OTP_VERIFY,
            param,
            this.apiManager.authorisedHttpOptions,
            true,
            true
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

    getStateList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STATE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            false
        );
    };

    getCityList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CITY_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getStudentCountryCodeList = (params): Observable<any> => {
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
