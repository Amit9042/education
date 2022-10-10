import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './components';
import { AdminRouteConstant } from 'edusense-admin/src/app/_shared/constants';
import { AdminAuthGuard } from 'edusense-admin/src/app/_shared/guards';


const routes: Routes = [
  {
    path: AdminRouteConstant.LOGIN_ROUTE,
    component: AdminLoginComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAuthRoutingModule { }
