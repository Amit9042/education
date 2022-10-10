import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    ApplicationApi,
    AppStorageConstants,
    HttpMethodsTypeEnum
} from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';
import { EncryptionFunctions } from '@sharedModule/functions';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    materialFilterData = null;

    constructor(private apiManager: APIManager) {}

    getSubList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_STUD_SUB_LIST_V3,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    listMaterial = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.MATERIAL_STUD_LIST_V3,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getMaterialDetails = (materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_STUD_DETAILS_V3 + '/' + materialId,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    downloadMaterial = (params, materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_STUD_DOWNLOAD_V3 + '/' + materialId,
            params,
            this.apiManager.authorisedBlobHttpOptions,
            true,
            true,
            {}
        );
    };

    getDownloadMaterial = (params, materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_STUD_DOWNLOAD_AUDIO_VIDEO_V3 +
                '/' +
                materialId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true,
            {}
        );
    };

    // To get & set material filter data
    getMaterialFilterData(): object {
        this.materialFilterData = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(
                AppStorageConstants.STUDENT_MATERIAL_FILTER_DATA
            )
        );
        return this.materialFilterData;
    }

    setMaterialFilterData(value: object): void {
        localStorage.setItem(
            AppStorageConstants.STUDENT_MATERIAL_FILTER_DATA,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.materialFilterData = value;
    }
}
