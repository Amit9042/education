import { Injectable } from '@angular/core';
import { APIManager } from '@sharedModule/services';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    constructor(private apiManager: APIManager) {}

    getProviderCourseList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.COURSE_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getUsersData = (): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.USERS_DATA,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateUsersData = (): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.USERS_DATA,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    createCourse = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.COURSE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getLanguageList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.LANGUAGE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getCourseDetails = (id: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.COURSE}/${id}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getCategoriesList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.CATEGORY_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateCourse = (
        id: number,
        params: any,
        fileObj: any[] = []
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT_MULTIPART,
            `${ApplicationApi.COURSE}/${id}`,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    getCoursePreview = (courseId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.COURSE_PREVIEW}/${courseId}/preview`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    publishCourse = (courseId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.COURSE_PREVIEW}/${courseId}/publish`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateSectionDetails = (
        sectionId: number,
        params: any
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.SECTION}/${sectionId}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateLectureDetails = (
        lectureId: number,
        params: any
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.LECTURES}/${lectureId}`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addLectureDetails = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.LECTURES,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addSection = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.SECTION,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeSection = (sectionId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.SECTION}/${sectionId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeLecture = (lectureId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.LECTURES}/${lectureId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeResource = (resourceId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.RESOURCE}/${resourceId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    removeContent = (lectureId: number, contentId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            `${ApplicationApi.LECTURES}/${lectureId}/content/${contentId}`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    generateSignedUrl = (lectureId: number, params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            `${ApplicationApi.LECTURES}/${lectureId}/video-url`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    storedVideoData = (
        lectureId: number,
        params: any,
        fileObj: any[] = []
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT_MULTIPART,
            `${ApplicationApi.LECTURES}/${lectureId}/video`,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    addContent = (
        lectureId: number,
        params: any,
        fileObj: any[] = []
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            `${ApplicationApi.LECTURES}/${lectureId}/content`,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    addResource = (params: any, fileObj: any[] = []): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.RESOURCE,
            params,
            this.apiManager.authorisedHttpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    saveVideoFile = (
        url: string,
        params: any,
        fileObj: any[] = []
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            url,
            params,
            this.apiManager.httpOptions,
            false,
            true,
            {},
            fileObj
        );
    };

    getAdditionalInformation = (courseId: number): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            `${ApplicationApi.COURSE}/${courseId}/additional-info`,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getSkillsList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.SKILLS_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addTag = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.TAGS,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateAdditionalInformation = (
        courseId: number,
        params: any
    ): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            `${ApplicationApi.COURSE}/${courseId}/additional-info`,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getTagsList = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.TAGS_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
