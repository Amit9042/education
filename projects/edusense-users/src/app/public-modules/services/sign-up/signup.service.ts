import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private apiManager: APIManager) { }

  signup(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.SIGN_UP,
      params,
      this.apiManager.Content_Type_HttpOptions,
      true,
      true
    );
  }

  verifyOtp(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.VERIFY_OTP,
      params,
      this.apiManager.Content_Type_HttpOptions,
      true,
      true
    );
  }

  resendOtp(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.RESEND_OTP,
      params,
      this.apiManager.Content_Type_HttpOptions,
      true,
      true
    );
  }
}
