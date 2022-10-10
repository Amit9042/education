import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRouteConstant } from '../../../_shared/constants';
import { ProviderListComponent, ProviderViewComponent } from './components';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ProviderListComponent
            },
            {
                path: AdminRouteConstant.PROVIDER_LIST_ROUTE,
                component: ProviderListComponent
            },
            {
                path: AdminRouteConstant.PROVIDER_VIEW_ROUTE,
                component: ProviderViewComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderRoutingModule {}
