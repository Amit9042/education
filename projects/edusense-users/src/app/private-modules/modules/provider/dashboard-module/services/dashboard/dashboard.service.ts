import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class DashBoardService {
    constructor(private apiManager: APIManager) {}

    getDashboardData = (): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.DASHBOARD_GET,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

}
