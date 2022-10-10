import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@sharedModule/guards';
import { RouteConstant } from '@sharedModule/constants';
import {
    HomePageComponent,
    StudentsPageComponent,
    ProvidersPageComponent,
    AboutUsComponent,
    PrivacyPolicyPageComponent,
    ContactUsPageComponent,
    TeamPageComponent
} from './components';

const routes: Routes = [
    {
        path: RouteConstant.HOME,
        component: HomePageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.STUDENTS,
        component: StudentsPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.PROVIDERS,
        component: ProvidersPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.ABOUT_US,
        component: AboutUsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.PRIVACY_POLICY,
        component: PrivacyPolicyPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: RouteConstant.CONTACT_US,
        component: ContactUsPageComponent,
        canActivate: [AuthGuard]
    },
    // {
    //     path: RouteConstant.TEAM,
    //     component: TeamPageComponent,
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
