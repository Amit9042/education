import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
    providedIn: 'root'
})
export class ParentClassesService {
    constructor(private apiManager: APIManager) {}


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


    addParentClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PARENT_CLASS_ADD,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    editParentClass = (params, classId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.PARENT_CLASS_EDIT + '/' + classId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    listParentClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PARENT_CLASS_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };


    getParentClassDetails = (classId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.PARENT_CLASS_DETAILS + '/' + classId,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateParentClass = (parentclassId,flag): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.PARENT_CLASS_ENABLE + '/' + parentclassId+ '/' + flag,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    assignParentClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ASSIGN_CLASS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };


    getStudentListForParentClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PARENT_CLASS_STUDENT_LIST_FILTER,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addStudentInParentClass = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PARENT_CLASS_ADD_STUDENT_IN,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    parentClassStudentList = (parentClassId, params: any): Observable<any> => {
        const endpoint = `${ApplicationApi.PARENT_CLASS_STUDENT_LIST}/${parentClassId}`;
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            endpoint,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeStudentFromParentClass = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PARENT_CLASS_REMOVE_STUDENT,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
}
