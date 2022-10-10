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
    RoleMaster,
    UserRoleStatus,
    APPROVE_USER_ROUTES
} from '@sharedModule/constants';
import {
    PUBLIC_ROUTES,
    RouteConstant,
    PROVIDER_ROUTES,
    STUDENT_ROUTES
} from '@sharedModule/constants';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private router: Router, private sharedService: SharedService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        let activateRoute;
        const readURL = state.url.split('?')[0];
        if (this.sharedService.isLoggedIn()) {
            activateRoute = true;
            const userConfig = this.sharedService.getUserConfig();
            const roleId = userConfig['user_role_link.role_id'];
            const isProfileCompleted = userConfig.is_profile_completed === 1;
            if (roleId == RoleMaster.STUDNET) {
                if (!STUDENT_ROUTES.includes(readURL)) {
                    this.router.navigate([
                        '/' + RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE
                    ]);
                    activateRoute = false;
                }
            } else if (
                isProfileCompleted &&
                roleId >= RoleMaster.PROVIDER_OWNER &&
                roleId <= RoleMaster.TEACHER
            ) {
                const provider =
                    userConfig.provider_list &&
                    userConfig.provider_list.length > 0
                        ? userConfig.provider_list[0]
                        : {};
                let isAllowed = true;
                if (
                    provider['status'] !== UserRoleStatus.APPROVED ||
                    provider['is_active'] === 0
                ) {
                    isAllowed = false;
                }
                if (!isAllowed && APPROVE_USER_ROUTES.includes(readURL)) {
                    this.router.navigate([
                        '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
                    ]);
                    activateRoute = false;
                } else if (!PROVIDER_ROUTES.includes(readURL)) {
                    this.router.navigate([
                        '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE
                    ]);
                    activateRoute = false;
                }
            } else {
                this.router.navigate(['/' + RouteConstant.LOGIN]);
                activateRoute = false;
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
