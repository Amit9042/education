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
export class QuestionBankService {
    private questionFilterData = null;

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

    getQuizFolderList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.QUIZ_FOLDER_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addQuizChaper = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.ADD_QUIZ_FOLDER,
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

    addQuestion = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.QUESTION,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true
        );
    };

    removeQuestion = (id: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            ApplicationApi.QUESTION + `/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    updateQuestion = (id, params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.QUESTION + `/${id}`,
            params,
            this.apiManager.authorisedHttpOptions,
            true,
            true
        );
    };

    uploadQuestionAttachment = (fileObj = []) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.QUESTION_ATTACHMENT,
            {},
            this.apiManager.authorisedHttpOptions,
            true,
            true,
            {},
            fileObj
        );
    };

    removeQuestionAttachment = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.DELETE_QUESTION_ATTACHMENT,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    uploadSolutionAttachment = (fileObj = []) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.SOLUTION_ATTACHMENT,
            {},
            this.apiManager.authorisedHttpOptions,
            true,
            true,
            {},
            fileObj
        );
    };

    removeSolutionAttachment = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.DELETE_SOLUTION_ATTACHMENT,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    uploadAnswerAttachment = (fileObj = []) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.ANSWER_ATTACHMENT,
            {},
            this.apiManager.authorisedHttpOptions,
            true,
            true,
            {},
            fileObj
        );
    };

    removeAnswerAttachment = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.DELETE_ANSWER_ATTACHMENT,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    // To get & set Question bank filter data
    getQuestionBankFilterData(): object {
        this.questionFilterData = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.QUESTION_BANK_FILTER_DATA)
        );
        return this.questionFilterData;
    }

    setQuestionBankFilterData(value: object): void {
        localStorage.setItem(
            AppStorageConstants.QUESTION_BANK_FILTER_DATA,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.questionFilterData = value;
    }
}
