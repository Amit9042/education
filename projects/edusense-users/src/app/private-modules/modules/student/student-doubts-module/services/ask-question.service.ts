import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationApi, AppStorageConstants, HttpMethodsTypeEnum } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';
import { EncryptionFunctions } from '@sharedModule/functions';

@Injectable({
  providedIn: 'root'
})
export class AskQuestionService {
  private askQuestionDetail: any = '';

  constructor(private apiManager: APIManager) { }

  askQuestion = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.ADD_QUESTION_V2,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        true,
        true
    );
  };

  fileUpload = (fileObj = []): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST_MULTIPART,
        ApplicationApi.IMAGE_UPLOAD,
        {},
        this.apiManager.authorisedHttpOptions,
        true,
        true,
        {},
        fileObj
    );
  };

  updateQuestion = (params, questionId): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        `${ApplicationApi.UPDATE_QUESTION_ANSWER_V2}/${questionId}`,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        true,
        true
    );
  };

  getSubList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.STUDENT_SUBJECT_LIST_V2,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        true
    );
  };

  getGradeList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.STUDENT_GRADE_LIST_V2,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        false
    );
  };

  getTeacherList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.TEACHER_LIST_V2,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        false
    );
  };

  getAskQuestionData() {
    if (!this.askQuestionDetail) {
        this.askQuestionDetail = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.ASK_QUESTION_DATA)
        );
    }
    return this.askQuestionDetail;
  }

  setAskQuestionData(value): void {
    localStorage.setItem(
        AppStorageConstants.ASK_QUESTION_DATA,
        EncryptionFunctions.ENCRYPT_OBJ(value)
    );
    this.askQuestionDetail = value;
  }
}
