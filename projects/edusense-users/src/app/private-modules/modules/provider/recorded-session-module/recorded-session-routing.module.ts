import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    RecordedSessionListComponent,
    RecordedSessionViewComponent
} from './components';
import { RecordingSessionResolver } from '../../../resolvers';

const routes: Routes = [
    {
        path: '',
        component: RecordedSessionListComponent,
        resolve: {
            resolvedData: RecordingSessionResolver
        }
    },
    {
        path: RouteConstant.RECORDED_SESSION_VIEW_ROUTE,
        component: RecordedSessionViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordedSessionRoutingModule {}
