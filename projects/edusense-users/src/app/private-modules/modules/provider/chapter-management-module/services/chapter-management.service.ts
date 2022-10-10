import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class ChapterManagementService {
    constructor(private apiManager: APIManager) {}

    getProviderChapterList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CHAPTER_MANAGEMENT_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    createProviderChapter = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CHAPTER,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    editProviderChapter = (params: any, chapterId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.CHAPTER}/${chapterId}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    removeProviderChapter = (chapterId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.CHAPTER}/${chapterId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    getChapterDetails = (chapterId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.CHAPTER}/${chapterId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
}
