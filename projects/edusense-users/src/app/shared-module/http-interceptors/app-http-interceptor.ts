import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {SharedService} from '@sharedModule/services';
import {AppMessageConstants, RouteConstant} from '@sharedModule/constants';
import {HttpStatus} from '@sharedModule/constants';
import { environment } from '../../../environments/environment';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

    constructor(private sharedService: SharedService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!navigator.onLine) {
            return throwError({error: 'NO INTERNET CONNECTION'});
        }
        const jwtReq = request.clone();
        // Pass on the cloned request instead of the original request.
        return next.handle(jwtReq)
            .pipe(
                tap((ev: HttpEvent<any>) => {
                    if (ev instanceof HttpResponse) {
                        // Additional processing logic
                    }
                }),
                catchError(errorResponse => {
                        if (errorResponse instanceof HttpErrorResponse) {
                            let message: string;
                            const url = errorResponse.url ? errorResponse.url : null;
                            const providerLoginUrl = `${environment.apiUrl}/provider/public/api/v1/login`; 
                            const studentLoginUrl = `${environment.apiUrl}/student/public/api/v1/login`;
                            
                            if (errorResponse.error && errorResponse.error['message'] && errorResponse.status != HttpStatus.PROVIDER_UUID_REQUIRE) {
                                message = errorResponse.error['message'];
                                this.sharedService.setSnackBar(message);
                            } else if (!message && errorResponse.status === HttpStatus.UNAUTHORIZED) {
                                message = AppMessageConstants.SESSION_EXPIRE;
                                this.sharedService.setSnackBar(message);
                            }
                            if ((url && (url === providerLoginUrl) || (url === studentLoginUrl)) && (errorResponse.status === HttpStatus.UNAUTHORIZED)) {
                                this.sharedService.logout(RouteConstant.LOGIN);
                            } else if (errorResponse.status === HttpStatus.UNAUTHORIZED) {
                                this.sharedService.logout();
                            }
                        }
                        return throwError(errorResponse);
                    }
                )
            );
    }
}
