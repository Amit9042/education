import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HttpMethodsTypeEnum,
    ApplicationApi,
    AppStorageConstants
} from '@sharedModule/constants';
import { APIManager } from '@sharedModule/services';
import { Material } from '../models/material.model';
import { EncryptionFunctions } from '@sharedModule/functions';
import { HttpEvent } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    private materialFilterData = null;

    constructor(private apiManager: APIManager) {}

    getTimezoneList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.TIMEZONE_LIST,
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
            true
        );
    };

    getSubList = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_SUB_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    addMaterialFile = (params, files): Observable<HttpEvent<any>> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST_MULTIPART,
            ApplicationApi.MATERIAL_ADD,
            params,
            this.apiManager.authorisedHttpOptionsWithProgress,
            true,
            false,
            {},
            files
        );
    };

    addMaterial = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.MATERIAL_ADD,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true,
            {}
        );
    };

    updateMaterialFile = (
        params,
        files,
        materialId
    ): Observable<HttpEvent<any>> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT_MULTIPART,
            ApplicationApi.MATERIAL_EDIT + '/' + materialId,
            params,
            this.apiManager.authorisedHttpOptionsWithProgress,
            true,
            true,
            {},
            files
        );
    };

    updateMaterial = (params, materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.MATERIAL_EDIT + '/' + materialId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true,
            {}
        );
    };

    editMaterial = (params, materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.MATERIAL_EDIT + '/' + materialId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    listMaterial = (params): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.POST,
            ApplicationApi.MATERIAL_LIST,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    getMaterialDetails = (materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_DETAILS + '/' + materialId,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };

    updateMaterialStatus = (params, materialId, statusId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.PUT,
            ApplicationApi.MATERIAL_UPDATE_STATUS +
                '/' +
                materialId +
                '/' +
                statusId,
            params,
            this.apiManager.authorisedAppJsonHttpOptions,
            true,
            true
        );
    };

    downloadMaterial = (params, materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_DOWNLOAD + '/' + materialId,
            params,
            this.apiManager.authorisedBlobHttpOptions,
            true,
            true,
            {}
        );
    };

    downloadMaterialBlob = (url): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            url,
            {},
            this.apiManager.blobHttpOptions,
            true,
            true,
            {}
        );
    };

    getDownloadMaterial = (params, materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.GET,
            ApplicationApi.MATERIAL_DOWNLOAD_V2 + '/' + materialId,
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
            localStorage.getItem(AppStorageConstants.MATERIAL_FILTER_DATA)
        );
        return this.materialFilterData;
    }

    setMaterialFilterData(value: object): void {
        localStorage.setItem(
            AppStorageConstants.MATERIAL_FILTER_DATA,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.materialFilterData = value;
    }

    removeMaterial = (materialId): Observable<any> => {
        return this.apiManager.httpHelperMethod(
            HttpMethodsTypeEnum.DELETE,
            ApplicationApi.MATERIAL_REMOVE + '/' + materialId,
            {},
            this.apiManager.authorisedAppJsonHttpOptions,
            false,
            true
        );
    };
}
