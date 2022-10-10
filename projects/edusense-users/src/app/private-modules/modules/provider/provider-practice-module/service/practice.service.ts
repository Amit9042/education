import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HttpMethodsTypeEnum,
    ApplicationApi,
    AppStorageConstants
} from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';
import { EncryptionFunctions } from '@sharedModule/functions';

@Injectable({
    providedIn: 'root'
})
export class PracticeService {
    private practiceFilterData = null;

    constructor(private apiManager: APIManager) {}

    getGradeList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_GRADE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getSubList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_SUB_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getParentClassList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PARENT_CLASS_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PRACTICE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addPractice = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PRACTICE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    updatePractice = (params, practiceId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.PRACTICE}/${practiceId}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    publishPractice = (practiceId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.PRACTICE}/${practiceId}/publish`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    getQuizChaperList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.QUIZ_CHAPTER_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getQuizFolderList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.QUIZ_FOLDER_LIST_PROVIDER,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getQuizQuestionList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.QUIZ_QUESTION_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getQuestionDetail = (id): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.QUESTION + `/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addQuestionToPractise = (params, practiseId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PRACTICE + `/${practiseId}/question`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    getAddedQuestionToPractise = (practiceId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.PRACTICE + `/${practiceId}/question`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    deleteQuestionFromPractise = (params, practiseId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PRACTICE + `/${practiseId}/delete/question`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    // To get & set Practice filter data
    getPracticeFilterData(): object {
        this.practiceFilterData = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.PRACTICE_FILTER_DATA)
        );
        return this.practiceFilterData;
    }

    setPracticeFilterData(value: object): void {
        localStorage.setItem(
            AppStorageConstants.PRACTICE_FILTER_DATA,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.practiceFilterData = value;
    }
}
