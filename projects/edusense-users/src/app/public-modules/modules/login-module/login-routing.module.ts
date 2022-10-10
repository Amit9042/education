import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { LoginContainerComponent } from './components';
import { AuthGuard } from '@sharedModule/guards';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: RouteConstant.LOGIN,
    //     pathMatch: "full"
    // },
    {
        path: RouteConstant.LOGIN,
        component: LoginContainerComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
