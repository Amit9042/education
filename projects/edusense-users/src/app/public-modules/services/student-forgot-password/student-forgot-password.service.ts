import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class StudentForgotPasswordService {
    constructor(private apiManager: APIManager) {}

    forgotStudentPassword = (param): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_FORGOT_PASSWORD,
            param,
            this.apiManager.Content_Type_HttpOptions,
            true,
            true
        );
    };

    verifyStudentOtp(params): Observable<any> {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_VERIFY_FORGOTPASSWORD_OTP,
            params,
            this.apiManager.Content_Type_HttpOptions,
            true,
            true
        );
    }

    resetStudentPassword(params): Observable<any> {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.RESET_STUDENT_PASSWORD,
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

    resendForgotPasswordOtp(params): Observable<any> {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.RESEND_FORGOT_PASSWORD_OTP,
            params,
            this.apiManager.Content_Type_HttpOptions,
            true,
            true
        );
    }
}
