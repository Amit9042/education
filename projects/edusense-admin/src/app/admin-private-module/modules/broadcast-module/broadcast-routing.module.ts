import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BroadcastDetailsComponent } from './components';
import { AdminRouteConstant } from '../../../_shared/constants';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BroadcastDetailsComponent
            },
            {
                path: AdminRouteConstant.BROADCAST_MODULE,
                component: BroadcastDetailsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BroadcastRoutingModule {}
