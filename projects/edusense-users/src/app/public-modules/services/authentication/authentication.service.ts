import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { APIManager, SharedService } from "@sharedModule/services";
import { Observable } from "rxjs/internal/Observable";
import { HttpMethodsTypeEnum, ApplicationApi } from "@sharedModule/constants";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    private apiManager: APIManager,
    private sharedService: SharedService
  ) {}

  login(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.LOGIN,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      true,
      true
    );
  }

  getUserDetails = (userId): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.GET,
      `${ApplicationApi.USER_PROFILE}/${userId}`,
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

  changePassword = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.PUT,
      ApplicationApi.CHANGE_PASSWORD,
      params,
      this.apiManager.authorisedHttpOptions,
      true,
      true
    );
  };

  getProviderConfig = (): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.GET,
      ApplicationApi.PROVIDER_CONFIG,
      {},
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };
}
