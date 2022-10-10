import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIManager } from '@sharedModule/services';
import { HttpMethodsTypeEnum, ApplicationApi } from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class ProviderRecordingService {
    constructor(protected apiManager: APIManager) {}

    getRecordingSessions = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.PROVIDER_RECORDING_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addRecordingSession = (params: any, file): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.PROVIDER_RECORDING_ADD,
            params,
            this.apiManager.authorisedHttpOptionsWithProgress,
            true,
            false,
            {},
            file
        );
    };

    editRecordingSession = (params: any, id): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.PROVIDER_RECORDING_EDIT + '/' + id,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    updateRecordingSession = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.PROVIDER_RECORDING_STATUS_UPDATE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };
    
    deleteRecordingSession = (params: any): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.PROVIDER_RECORDING_DELETE,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    getRecordingSession = (recId: number): Observable<any> => {
        const endPoint =
            ApplicationApi.PROVIDER_RECORDING_DETAILS + '/' + recId;
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            endPoint,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getRecordingSessionStream = (recId: number): Observable<any> => {
        const endPoint = ApplicationApi.PROVIDER_RECORDING_STREAM + '/' + recId;
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            endPoint,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
