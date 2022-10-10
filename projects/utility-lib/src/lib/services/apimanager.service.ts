/**
 *
 * Author: smartSense Consulting Solutions Pvt. Ltd.
 * Website: https://smartsensesolutions.com
 * Date: Sep 24 2018 11:30 AM
 * Copyright @ 2018 smartSense Consulting Solutions Pvt. Ltd.
 *
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from './shared.service';
import { HttpHelperService } from './http-helper.service';
import { Observable } from 'rxjs';
import { HttpMethodsTypeEnum } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class APIManager extends HttpHelperService {
    constructor(sharedService: SharedService, http: HttpClient) {
        super(sharedService, http);
    }

    /**
     * method name : overridable httpHelperMethod
     * purpose : handle loader, and call overload in parent class for getting Observable of response
     * created : Sep 24 2018 11:30 AM
     * Revision :
     */
    httpHelperMethod(
        methodType: HttpMethodsTypeEnum,
        url: string,
        params = {},
        httpOptions = this.authorisedHttpOptions,
        showSnackBar,
        showLoader,
        searchParams = {},
        filesObj?: any
    ): Observable<any> {
        if (showLoader) {
            this.sharedService.setLoader(true);
        }
        if (
            methodType === HttpMethodsTypeEnum.POST_MULTIPART ||
            methodType === HttpMethodsTypeEnum.PUT_MULTIPART
        ) {
            const formData = this.createFormDataObject(params, filesObj);
            params = formData;
        }
        return super.httpHelperMethod(
            methodType,
            url,
            params,
            httpOptions,
            showSnackBar,
            showLoader,
            searchParams
        );
    }

    get authorisedHttpOptions() {
        const authToken = this.sharedService.getToken();
        const httpOptions = new HttpHeaders({
            Authorization: `Bearer ${authToken}`
        });
        return { headers: httpOptions };
    }

    get authorisedBlobHttpOptions(): any {
        const authToken = this.sharedService.getToken();
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${authToken}`
            }),
            responseType: 'blob'
        };
    }

    get authorisedURLEncodedHttpOptions() {
        const authToken = this.sharedService.getToken();
        const httpOptions = new HttpHeaders({
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        return { headers: httpOptions };
    }

    get authorisedAppJsonHttpOptions() {
        const authToken = this.sharedService.getToken();
        const httpOptions = new HttpHeaders({
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        });
        return { headers: httpOptions };
    }

    // return authorisation header with only content-type
    get Content_Type_HttpOptions() {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return { headers: httpOptions };
    }

    /**
     * return formData object from filesObject
     */
    createFormDataObject = (params, filesObj) => {
        const formData = new FormData();
        if (params && Object.keys(params).length) {
            for (const docKey in params) {
                if (typeof params[docKey] === 'object') {
                    formData.append(docKey, JSON.stringify(params[docKey]));
                } else {
                    formData.append(docKey, params[docKey]);
                }
            }
        }
        for (const obj of filesObj) {
            for (const file of obj.files) {
                formData.append(obj.reqKey, file, file.name);
            }
        }
        return formData;
    };
}
