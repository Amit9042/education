import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class ClassAttendanceService {
    constructor(private apiManager: APIManager) {}

    getAttendanceList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ATTENDANCE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getAttendanceDetails = (id: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.ATTENDANCE_LIST}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getAttendedStudentsList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ATTENDED_STUDENTS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getStudentSessionHistory = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_SESSION_HISTORY,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
