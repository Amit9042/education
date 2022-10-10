import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private apiManager: APIManager) {}

    inviteUser = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.USER_INVITE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true,
            {}
        );
    };

    getlist = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.USER_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getDetails = (param, id): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.USER_DETAILS + '/' + id,
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
    
    inviteResend = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.USER_INVITE_RESEND,
            param,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    updateUserStatus = (params, userId, statusId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.USER_UPDATE_STATUS + '/' + userId + '/' + statusId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    updateUser = (params, userId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.USER_EDIT_V2 + '/' + userId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true,
            {}
        );
    };
}
