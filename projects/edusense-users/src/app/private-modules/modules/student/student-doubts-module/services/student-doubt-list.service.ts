import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationApi, HttpMethodsTypeEnum } from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';

@Injectable({
  providedIn: 'root'
})
export class StudentDoubtListService {

  constructor(private apiManager: APIManager) { }

  getStudentQuestionList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
        HttpMethodsTypeEnum.POST,
        ApplicationApi.STUDENT_QUESTION_LIST_V2,
        params,
        this.apiManager.authorisedAppJsonHttpOptions,
        false,
        true
    );
  };
}
