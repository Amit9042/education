import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    EditProfileContainerComponent,
    ViewProfileContainerComponent
} from './components';
import { RoleGuard } from '@sharedModule/guards';

const routes: Routes = [
    {
        path: '',
        component: ViewProfileContainerComponent
    },
    {
        path: RouteConstant.PROFILE_DETAILS_VIEW_ROUTE,
        component: ViewProfileContainerComponent
    },
    {
        path: RouteConstant.PROFILE_DETAILS_EDIT_ROUTE,
        component: EditProfileContainerComponent,
        canActivate: [RoleGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileDetailsRoutingModule {}
