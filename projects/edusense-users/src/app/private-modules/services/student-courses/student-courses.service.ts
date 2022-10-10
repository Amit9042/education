import { Injectable } from '@angular/core';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';
import { Observable } from 'rxjs';
import { APIManager } from 'utility-lib';

@Injectable({
  providedIn: 'root'
})
export class StudentCoursesService {

  constructor(
    private apiManager: APIManager
  ) { }

  allCourseList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.DISCOVER_LIST,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  bookMarkCourse = (params: any, courseId: number): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      `${ApplicationApi.DISCOVER}/${courseId}/bookmark`,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  getBookmarkedCourses = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.BOOKMARK_COURSE_LIST,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  studentCourseList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.MY_COURSES,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  getCourseDetails = (courseId: number, params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.GET,
      `${ApplicationApi.DISCOVER}/${courseId}`,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  resourceList = (enrollmentId: number, lectureId: number): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.GET,
      `${ApplicationApi.SUBSCRIBED}/${enrollmentId}/lectures/${lectureId}/resources`,
      {},
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  lectureList = (enrollmentId: number): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.GET,
      `${ApplicationApi.SUBSCRIBED}/${enrollmentId}/lectures`,
      {},
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  lectureDetail = (enrollmentId: number, lectureId: number): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.GET,
      `${ApplicationApi.SUBSCRIBED}/${enrollmentId}/lectures/${lectureId}`,
      {},
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  updateLectureProgress = (enrollmentId: number, lectureId: number, params: {}): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.PUT,
      `${ApplicationApi.SUBSCRIBED}/${enrollmentId}/lectures/${lectureId}`,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  enrollIntoCourse = (courseId: number, params: {}): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      `${ApplicationApi.DISCOVER}/${courseId}/enroll`,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };


}
