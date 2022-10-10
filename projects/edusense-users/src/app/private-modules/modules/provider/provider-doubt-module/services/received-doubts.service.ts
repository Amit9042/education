import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
  providedIn: 'root'
})
export class ReceivedDoubtsService {

  constructor(private apiManager: APIManager) { }

  getReceivedQuestionList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.RECEIVED_DOUBT_LIST,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        true
    );
  };

  getGradeList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.GET,
        ApplicationApi.MATERIAL_GRADE_LIST,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        false
    );
  };

  getSubList = (params): Observable<any> => {
      return this.apiManager.httpHelperMethod(
          HttpMethodsTypeEnum.GET,
          ApplicationApi.MATERIAL_SUB_LIST,
          params,
          this.apiManager.authorisedAppJsonHttpOptions,
          false,
          false
      );
  };

  getAllDoubts = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.PROVIDER_ALL_DOUBTS,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        false
    );
};
}
