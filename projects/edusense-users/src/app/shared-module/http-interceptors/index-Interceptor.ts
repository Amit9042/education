import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppHttpInterceptor} from './app-http-interceptor';

/** Http interceptor providers in outside-in order */
export const HttpInterceptors = [
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}
];

