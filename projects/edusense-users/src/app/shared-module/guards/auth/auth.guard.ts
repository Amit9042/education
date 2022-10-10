import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '@sharedModule/services';
import {
    PUBLIC_ROUTES,
    RouteConstant,
    UserTypeEnum,
    RoleMaster
} from '@sharedModule/constants';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private sharedService: SharedService,
        private _mixpanelService: MixpanelService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        let activateRoute;
        const readURL = state.url.split('?')[0];
        if (this.sharedService.isLoggedIn()) {
            const userConfig = this.sharedService.getUserConfig();
            if (userConfig) {
                this._mixpanelService.init(userConfig);
            } else {
                this._mixpanelService.isInitialized = false;
            }
            if (
                userConfig &&
                userConfig['user_role_link.role_id'] ===
                    RoleMaster.PROVIDER_OWNER &&
                userConfig.is_profile_completed === 0 &&
                readURL !== '/' + RouteConstant.BUILD_PROFILE
            ) {
                this.router.navigate(['/' + RouteConstant.BUILD_PROFILE]);
                activateRoute = false;
            } else if (
                userConfig &&
                userConfig['user_role_link.role_id'] === RoleMaster.STUDNET &&
                userConfig.is_profile_completed === 0 &&
                readURL !== '/' + RouteConstant.STUDENT_BUILD_PROFILE
            ) {
                this.router.navigate([
                    '/' + RouteConstant.STUDENT_BUILD_PROFILE
                ]);
                activateRoute = false;
            } else if (
                (userConfig && PUBLIC_ROUTES.includes(readURL)) ||
                (userConfig.is_profile_completed === 1 &&
                    (readURL === '/' + RouteConstant.BUILD_PROFILE ||
                        readURL === '/' + RouteConstant.STUDENT_BUILD_PROFILE))
            ) {
                const userConfig = this.sharedService.getUserConfig();
                const route =
                    userConfig.app_id === UserTypeEnum.PROVIDER
                        ? '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
                        : '/' + RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE;
                this.router.navigate([route]);
                activateRoute = false;
            } else if (!userConfig && PUBLIC_ROUTES.includes(readURL)) {
                const userType = this.sharedService.getSignupType();
                const route =
                    userType === UserTypeEnum.PROVIDER
                        ? '/' + RouteConstant.BUILD_PROFILE
                        : '/' + RouteConstant.STUDENT_BUILD_PROFILE;
                this.router.navigate([route]);
                activateRoute = false;
            } else {
                activateRoute = true;
            }
        } else {
            if (!PUBLIC_ROUTES.includes(readURL)) {
                this.router.navigate(['/' + RouteConstant.LOGIN]);
                activateRoute = false;
            } else {
                activateRoute = true;
            }
        }
        return activateRoute;
    }
}
