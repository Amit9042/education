import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RouteConstant} from '@sharedModule/constants';
import {MobileStreamingComponent} from './components/streaming/mobile-streaming.component';

const routes: Routes = [
  {
    path: RouteConstant.MOBILE_STREAMING_ROUTE,
    component: MobileStreamingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileRoutingModule {
}
