import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager, HttpMethodsTypeEnum } from 'utility-lib';
import { AdminApi } from 'edusense-admin/src/app/_shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ProviderListService {

  constructor(private apiManager: APIManager) { }

  providerList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        AdminApi.PROVIDER_LIST,
        params,
        this.apiManager.authorisedHttpOptions,
        false,
        true
    );
  };

  enableDisableProvider = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        AdminApi.ENABLE_DISABLE_PROVIDER,
        params,
        this.apiManager.authorisedHttpOptions,
        true,
        true
    );
  };

  approveRejectProvider = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        AdminApi.APPROVE_REJECT_PROVIDER,
        params,
        this.apiManager.authorisedHttpOptions,
        true,
        true
    );
  };
}
