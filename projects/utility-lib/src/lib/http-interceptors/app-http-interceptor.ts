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
import {SharedService} from '../services';
import {AppMessageConstants} from '../constants';
import {HttpStatus} from '../constants';

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
                            
                            if (errorResponse.error && errorResponse.error['message']) {
                                message = errorResponse.error['message'];
                                this.sharedService.setSnackBar(message);
                            } else if (!message && errorResponse.status === HttpStatus.UNAUTHORIZED) {
                                message = AppMessageConstants.SESSION_EXPIRE;
                                this.sharedService.setSnackBar(message);
                            }
                            if (errorResponse.status === HttpStatus.UNAUTHORIZED) {
                                this.sharedService.logout();
                            }
                        }
                        return throwError(errorResponse);
                    }
                )
            );
    }
}
