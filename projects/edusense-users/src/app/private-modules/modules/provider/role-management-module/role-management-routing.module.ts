import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    RoleManagementListComponent,
    RoleManagementViewComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        component: RoleManagementListComponent
    },
    {
        path: RouteConstant.ROLE_MANAGEMENT_LIST_ROUTE,
        component: RoleManagementListComponent
    },
    {
        path: RouteConstant.ROLE_MANAGEMENT_VIEW_ROUTE,
        component: RoleManagementViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleManagementRoutingModule {}
