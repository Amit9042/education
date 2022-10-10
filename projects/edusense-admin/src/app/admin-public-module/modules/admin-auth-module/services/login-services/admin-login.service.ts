import { Injectable } from '@angular/core';
import { APIManager, HttpMethodsTypeEnum } from 'utility-lib';
import { Observable } from 'rxjs';
import { AdminApi } from 'edusense-admin/src/app/_shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  constructor(private apiManager: APIManager) { }

  login(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      AdminApi.LOGIN,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      true,
      true
    );
  }
}
