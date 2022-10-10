import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    SignUpContainerComponent,
    ResetPasswordComponent,
    BuildProfileComponent,
    PersonalInfoComponent
} from './components';
import { RouteConstant } from '@sharedModule/constants';
import { ForgotPasswordFlowContainerComponent } from './components/forgot-password-flow/forgot-password-flow-container/forgot-password-flow-container.component';
import { ProfileResolverService } from '../../resolvers';
import { AuthGuard } from '@sharedModule/guards';

const routes: Routes = [
    {
        path: RouteConstant.SIGN_UP,
        component: SignUpContainerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.FORGOT_PASSWORD,
        component: ForgotPasswordFlowContainerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.RESET_PASSWORD,
        component: ResetPasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.BUILD_PROFILE,
        component: BuildProfileComponent,
        resolve: {
            resolvedData: ProfileResolverService
        },
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.PERSONAL_INFO,
        component: PersonalInfoComponent
    },
    {
        path: RouteConstant.PERSONAL_INFO,
        component: PersonalInfoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserAuthRoutingModule {}
