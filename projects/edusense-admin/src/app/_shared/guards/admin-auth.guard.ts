import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from 'utility-lib';
import { PUBLIC_ROUTES } from '../constants/admin-app-routes.constants';
import { AdminRouteConstant } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
    constructor(private router: Router, private sharedService: SharedService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        let activateRoute;
        const readURL = state.url.split('?')[0];
        if (this.sharedService.isLoggedIn()) {
            if (PUBLIC_ROUTES.includes(readURL)) {
                this.router.navigate(['/' + AdminRouteConstant.PROVIDER_LIST]);
                activateRoute = false;
            } else {
                activateRoute = true;
            }
        } else {
            if (!PUBLIC_ROUTES.includes(readURL)) {
                this.router.navigate(['/' + AdminRouteConstant.LOGIN_ROUTE]);
                activateRoute = false;
            } else {
                activateRoute = true;
            }
        }
        return activateRoute;
    }
}
