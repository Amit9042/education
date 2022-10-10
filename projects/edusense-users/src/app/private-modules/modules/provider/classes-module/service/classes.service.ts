import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class ClassesService {
    constructor(private apiManager: APIManager) {}

    getTimezoneList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.TIMEZONE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getGradeList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.GRADE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getSubjectList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.SUBJECT_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CLASS_ADD_V2,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    editClass = (params, classId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.CLASS_EDIT_V2 + '/' + classId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    listClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CLASS_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    goLiveClassList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.GOLIVE_CLASS_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getClassDetails = (classId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.CLASS_DETAILS + '/' + classId,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateClass = (params, classId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.CLASS_UPDATE + '/' + classId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    assignClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ASSIGN_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    joinClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PROVIDER_JOIN_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    leaveClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PROVIDER_LEAVE_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getStudentListForClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.STUDENT_LIST_TO_ADD_IN_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addStudentInClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ADD_STUDENT_IN_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    classStudentList = (classId, params: any): Observable<any> => {
        const endpoint = `${ApplicationApi.CLASS_STUDENT_LIST}/${classId}`;
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            endpoint,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeStudentFromClass = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.REMOVE_STUDENT_FROM_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    classJoined = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PROVIDER_CLASS_JOINED,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    cloneClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CLASS_CLONE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    assignParentClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ASSIGN_PARENT_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
}
