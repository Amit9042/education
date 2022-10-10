import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
  providedIn: 'root'
})
export class StudentSignupService {

  constructor(private apiManager: APIManager) { }

  signup(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.STUDENT_SIGN_UP,
      params,
      this.apiManager.Content_Type_HttpOptions,
      true,
      true
    );
  }

  verifyOtp(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.STUDENT_VERIFY_OTP,
      params,
      this.apiManager.Content_Type_HttpOptions,
      true,
      true
    );
  }

  resendOtp(params): Observable<any> {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.STUDENT_RESEND_OTP,
      params,
      this.apiManager.Content_Type_HttpOptions,
      true,
      true
    );
  }
}
