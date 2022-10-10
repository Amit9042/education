import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpMethodsTypeEnum, ApplicationApi } from "@sharedModule/constants";
import { APIManager } from "@sharedModule/services";

@Injectable({
  providedIn: "root",
})
export class CityService {
  constructor(private apiManager: APIManager) {}

  getCityList = (params): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.CITY_LIST,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };
}
