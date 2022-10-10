import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
  providedIn: 'root'
})
export class QuestionAnswerService {

  constructor(private apiManager: APIManager) { }

  questionDetail = (questionId): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.GET,
        `${ApplicationApi.QUESTIN_DETAIL}/${questionId}`,
        {},
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        true
    );
  }

  addAnswer = (questionId, params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        `${ApplicationApi.ADD_ANSWER}/${questionId}`,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        true,
        true
    );
  };

  updateAnswer = (questionId, answerId, params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        `${ApplicationApi.UPDATE_QUESTION_ANSWER}/${questionId}/comment/${answerId}`,
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

  deleteQuestion = (questionId): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        `${ApplicationApi.DELETE_QUESTION_ANSWER}/${questionId}`,
        {},
        this.apiManager.authorisedAppJsonHttpOptions,
        true,
        true
    );
  };

  deleteComment = (questionId, commentId): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.PUT,
        `${ApplicationApi.DELETE_QUESTION_ANSWER}/${questionId}/comment/${commentId}`,
        {},
        this.apiManager.authorisedAppJsonHttpOptions,
        true,
        true
    );
  };
}
