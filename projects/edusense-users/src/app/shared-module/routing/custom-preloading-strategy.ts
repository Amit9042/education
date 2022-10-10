import { PreloadingStrategy, Route } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, fn: () => Observable<any>): Observable<any> {
        return route.data && route.data.preload ? fn() : of(null);
    }
}
