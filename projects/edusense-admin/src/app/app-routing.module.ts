import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRouteConstant } from './_shared/constants';
import { AdminAuthGuard } from './_shared/guards';

const routes: Routes = [
    {
        path: '',
        redirectTo: AdminRouteConstant.LOGIN_ROUTE,
        pathMatch: 'full'
    },
    {
        path: AdminRouteConstant.PROVIDER_MODULE_ROUTE,
        loadChildren: () =>
            import(
                './admin-private-module/modules/provider-module/provider.module'
            ).then((m) => m.ProviderModule),
        canActivate: [AdminAuthGuard]
    },
    {
        path: AdminRouteConstant.BROADCAST_MODULE,
        loadChildren: () =>
            import(
                './admin-private-module/modules/broadcast-module/broadcast.module'
            ).then((m) => m.BroadcastModule)
    },
    {
        path: '**',
        redirectTo: AdminRouteConstant.LOGIN_ROUTE,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
