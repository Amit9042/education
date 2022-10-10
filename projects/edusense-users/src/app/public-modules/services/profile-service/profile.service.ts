import { APIManager } from "@sharedModule/services";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpMethodsTypeEnum, ApplicationApi, AppStorageConstants } from "@sharedModule/constants";
import { EncryptionFunctions } from '@sharedModule/functions';

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private profileData: any = null;
  constructor(private apiManager: APIManager) {}

  addUserProfileDetail = (params, fileObj = []): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST_MULTIPART,
      ApplicationApi.CREATE_USER_PROFILE,
      params,
      this.apiManager.authorisedHttpOptions,
      true,
      true,
      {},
      fileObj
    );
  };

  addStudentProfileDetail = (params, fileObj = []): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST_MULTIPART,
      ApplicationApi.CREATE_STUDENT_PROFILE,
      params,
      this.apiManager.authorisedHttpOptions,
      true,
      true,
      {},
      fileObj
    );
  };

  getProviderTypeList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.PROVIDER_TYPE_LIST,
      params,
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };

  getGradeList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.GRADE_LIST,
      params,
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };

  getBoardList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.BOARD_LIST,
      params,
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };

  getMediumList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.MEDIUM_LIST,
      params,
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };

  getSubjectList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.SUBJECT_LIST,
      params,
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };

  getCountryList = (params: any): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      ApplicationApi.COUNTRY_LIST,
      params,
      this.apiManager.authorisedHttpOptions,
      false,
      false
    );
  };

  getBuildProfileData() {
    if (!this.profileData) {
      this.profileData = EncryptionFunctions.DECRYPT_OBJ(
        localStorage.getItem(AppStorageConstants.PROVIDER_BUILD_PROFILE_DATA),
        AppStorageConstants.PROVIDER_BUILD_PROFILE_DATA
      );
    }
    return this.profileData;
  }

  setBuildProfileData(value): void {
    localStorage.setItem(
      AppStorageConstants.PROVIDER_BUILD_PROFILE_DATA,
      EncryptionFunctions.ENCRYPT_OBJ(value)
    );
    this.profileData = value;
  }
}
