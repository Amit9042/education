import {Injectable} from '@angular/core';
import {APIManager} from '@sharedModule/services';
import {Observable} from 'rxjs';
import {ApplicationApi, HttpMethodsTypeEnum, UserTypeEnum} from '@sharedModule/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private apiManager: APIManager) {}

  getBadgeCount = (params, endpoint): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      endpoint,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  getNotificationList = (params, endpoint): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.POST,
      endpoint,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  readAllNotifications = (params, endpoint): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.PUT,
      endpoint,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };

  viewReadNotification = (params, endpoint): Observable<any> => {
    return this.apiManager.httpHelperMethod(
      HttpMethodsTypeEnum.PUT,
      endpoint,
      params,
      this.apiManager.authorisedAppJsonHttpOptions,
      false,
      true
    );
  };
}
