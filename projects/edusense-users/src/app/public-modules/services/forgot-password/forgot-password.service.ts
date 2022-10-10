import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs/internal/Observable';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {
    constructor(private apiManager: APIManager) {}

    forgotPassword = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.FORGOT_PASSWORD,
            param,
            this.apiManager.Content_Type_HttpOptions,
            true,
            true
        );
    };

    verifyForgotPasswordOtp(params): Observable<any> {
      return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.VERIFY_FORGOTPASSWORD_OTP,
        params,
        this.apiManager.Content_Type_HttpOptions,
        true,
        true
      );
    }

    resetPassword(params): Observable<any> {
      return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        ApplicationApi.RESET_PROVIDER_PASSWORD,
        params,
        this.apiManager.Content_Type_HttpOptions,
        true,
        true
      );
    }
  
    resendForgotPasswordOtp(params): Observable<any> {
      return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.RESEND_PROVIDER_FORGOT_PASSWORD_OTP,
        params,
        this.apiManager.Content_Type_HttpOptions,
        true,
        true
      );
    }
}
