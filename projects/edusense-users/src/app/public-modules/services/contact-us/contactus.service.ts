import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class ContactusService {
    constructor(private apiManager: APIManager) {}

    submitContactReq = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.USER_CONTACT_US,
            param,
            this.apiManager.Content_Type_HttpOptions,
            true,
            true
        );
    };
}
