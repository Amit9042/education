import { Injectable } from "@angular/core";
import { APIManager } from "@sharedModule/services";
import { Observable } from "rxjs";
import { HttpMethodsTypeEnum, ApplicationApi } from "@sharedModule/constants";

@Injectable({
  providedIn: "root",
})
export class StateService {
  constructor(private apiManager: APIManager) {}

  getStateList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.STATE_LIST,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };
}
