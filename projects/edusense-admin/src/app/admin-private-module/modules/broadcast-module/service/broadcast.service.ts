import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager, HttpMethodsTypeEnum } from 'utility-lib';
import { AdminApi } from 'edusense-admin/src/app/_shared/constants';

@Injectable({
    providedIn: 'root'
})
export class BroadcastService {
    constructor(private apiManager: APIManager) {}

    broadCastMessage = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            AdminApi.BROADCAST_MESSAGE,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true
        );
    };
}
