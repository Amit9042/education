import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementListComponent, UserManagementViewComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';


const routes: Routes = [
  {
    path: "",
    component: UserManagementListComponent,
  },
  {
    path: RouteConstant.USER_MANAGEMENT_LIST_ROUTE,
    component: UserManagementListComponent,
  },
  {
    path: RouteConstant.USER_MANAGEMENT_VIEW_ROUTE + '/:id',
    component: UserManagementViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
