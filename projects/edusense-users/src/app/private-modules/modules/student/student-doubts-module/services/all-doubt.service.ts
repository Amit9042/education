import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
  providedIn: 'root'
})
export class AllDoubtService {

  constructor(private apiManager: APIManager) { }

  getAllDoubtList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.STUDENT_ALL_DOUBTS_V2,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        true
    );
  };

  bookmarkQuestion = (questionId): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        `${ApplicationApi.BOOKMARK_QUESTION}/${questionId}`,
        {},
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
}
