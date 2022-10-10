/**
 * created mainly for code separation and this service file will handle http methods related tasks
 * Author: smartSense Consulting Solutions Pvt. Ltd.
 * Website: https://smartsensesolutions.com
 * Date: Sep 24 2018 11:30 AM
 * Copyright @ 2018 smartSense Consulting Solutions Pvt. Ltd.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SharedService } from './shared.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { isEmpty } from '../functions';
import { HttpMethodsTypeEnum } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class HttpHelperService {
    constructor(
        protected sharedService: SharedService,
        protected http: HttpClient
    ) {}

    /**
     * purpose : to return Observable of any(http response,error)
     * created : Sep 24 2018 11:30 AM
     * Revision :
     */
    protected httpHelperMethod(
        methodType: HttpMethodsTypeEnum,
        url: string,
        params = {},
        httpOptions,
        showSnackBar: boolean,
        showLoader: boolean,
        searchParams
    ) {
        return this.apiCall(
            methodType,
            url,
            params,
            httpOptions,
            searchParams
        ).pipe(
            tap((response: any) => {
                this.setSnackBarMessage(response, showSnackBar);
                return response || {};
            }),
            catchError(this.handleError('', [])),
            finalize(() => {
                if (showLoader) {
                    this.sharedService.setLoader(false);
                }
            })
        );
    }

    /**
     * method name : apiCall
     * purpose : Communicate with server to get api data
     * created : Sep 24 2018 11:30 AM
     */

    private apiCall(
        methodType: HttpMethodsTypeEnum,
        url: string,
        params = {},
        httpOptions,
        searchParams = {}
    ): Observable<any> {
        switch (methodType) {
            case HttpMethodsTypeEnum.GET:
                return this.http.get<any>(
                    this.prepareEndpoint(url, params, searchParams),
                    httpOptions
                );
            case HttpMethodsTypeEnum.POST:
            case HttpMethodsTypeEnum.POST_MULTIPART:
                return this.http.post<any>(url, params, httpOptions);
            case HttpMethodsTypeEnum.PUT:
            case HttpMethodsTypeEnum.PUT_MULTIPART:
                return this.http.put<any>(url, params, httpOptions);
            case HttpMethodsTypeEnum.DELETE:
                return this.http.delete(
                    this.prepareEndpoint(url, params),
                    httpOptions
                );
        }
    }

    /**
     * method name : handleError
     * purpose : handler error for api call
     * created : Sep 24 2018 11:30 AM
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            return throwError(error);
        };
    }

    /**
     * method name : prepareEndpoint
     * purpose : Prepare end point with query string
     * created : Sep 24 2018 11:30 AM
     */
    private prepareEndpoint(endPoint: string, params: any, searchParams = {}) {
        if (!isEmpty(searchParams)) {
            params['search'] = JSON.stringify(searchParams);
        }
        if (Object.keys(params).length) {
            if (params) {
                endPoint += '?';
            }
            let count = 0;
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    endPoint +=
                        count > 0
                            ? `&${key}=${params[key]}`
                            : `${key}=${params[key]}`;
                    count++;
                }
            }
        }
        return endPoint;
    }

    /**
     * method name : setSnackBarMessage
     * purpose : Set snake bar
     * created : Sep 24 2018 11:30 AM
     */
    private setSnackBarMessage(res: any, show?: boolean) {
        const msg = res && res.message ? res.message : '';
        if (show && msg) {
            this.sharedService.setSnackBar(msg);
        }
    }
}
