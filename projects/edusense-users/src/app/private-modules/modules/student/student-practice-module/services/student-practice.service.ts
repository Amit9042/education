import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import {
    ApplicationApi,
    HttpMethodsTypeEnum,
    AppStorageConstants
} from '@sharedModule/constants';
import { EncryptionFunctions } from '@sharedModule/functions';

@Injectable({
    providedIn: 'root'
})
export class StudentPracticeService {
    isPracticeDetailView: boolean = false;

    constructor(private apiManager: APIManager) {}

    getPracticeList = (params, providerUUID: string): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.STUDENT_PRACTICE_LIST}?providerUUID=${providerUUID}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeDetails = (
        id: number,
        providerUUID: string
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.STUDENT_PRACTICE_DETAILS}/${id}?providerUUID=${providerUUID}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeQuestions = (
        id: number,
        params: any,
        providerUUID: string
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.STUDENT_PRACTICE_DETAILS}/${id}/question/filter?providerUUID=${providerUUID}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    loadQuestionForPractise = (practiceId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.STUDENT_PRACTICE_DETAILS}/question/${practiceId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    submitAnswer = (
        practiseSession,
        params: any,
        providerUUID: string
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.STUDENT_QUIZ_SUBMIT}/${practiseSession}/question?providerUUID=${providerUUID}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPreviosQuestion = (
        practiceId,
        questionId,
        params: any
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.PRACTICE}/${practiceId}/question/${questionId}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    bookmarkedQuestion = (
        practiceId: number,
        status: boolean,
        questionId: number,
        params: any
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.PRACTICE}/${practiceId}/toggle/${status}/question/${questionId}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    getBookmarkPracticeList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.STUDENT_BOOKMARKED_PRACTICE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getQuestionBasedOnPractice = (
        practiceId: number,
        params: any
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.STUDENT_BOOKMARKED_PRACTICE_LIST}/${practiceId}/question`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    finishPractise = (practiseSession, providerUUID: string) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.STUDENT_QUIZ_FINISH}/${practiseSession}?providerUUID=${providerUUID}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeChapterList = (params: any, providerUUID: string) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.STUDENT_CHAPTER_LIST}?providerUUID=${providerUUID}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeDetailsForView = (id: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.STUDENT_PRACTICE_DETAIL_VIEW}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getPracticeResult = (practiceId: number) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.STUDENT_PRACTICE_RESULT}/${practiceId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    pausePractise = (practiseSession, providerUUID: string) => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.STUDENT_QUIZ_PAUSE}/${practiseSession}?providerUUID=${providerUUID}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getIsPracitceDetailView() {
        if (!this.isPracticeDetailView) {
            this.isPracticeDetailView = EncryptionFunctions.DECRYPT_OBJ(
                localStorage.getItem(
                    AppStorageConstants.IS_PRACTICE_DETAIL_VIEW
                )
            );
        }
        return this.isPracticeDetailView;
    }

    setIsPracitceDetailView(value): void {
        localStorage.setItem(
            AppStorageConstants.IS_PRACTICE_DETAIL_VIEW,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.isPracticeDetailView = value;
    }
}
