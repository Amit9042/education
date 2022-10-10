import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    StudentBuildProfileComponent,
    StudentResetPasswordComponent,
    StudentForgotPasswordFlowContainerComponent,
    StudentSignUpContainerComponent
} from './components';
import { StudentProfileResolverService } from '../../resolvers/student-profile/student-profile-resolver.service';
import { AuthGuard, RoleGuard } from '@sharedModule/guards';

const routes: Routes = [
    {
        path: RouteConstant.STUDENT_SIGN_UP,
        component: StudentSignUpContainerComponent,
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_FORGOT_PASSWORD,
        component: StudentForgotPasswordFlowContainerComponent,
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_RESET_PASSWORD,
        component: StudentResetPasswordComponent,
        canActivate: [AuthGuard, RoleGuard]
    },
    {
        path: RouteConstant.STUDENT_BUILD_PROFILE,
        component: StudentBuildProfileComponent,
        canActivate: [AuthGuard],
        resolve: {
            resolvedData: StudentProfileResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentAuthRoutingModule {}
