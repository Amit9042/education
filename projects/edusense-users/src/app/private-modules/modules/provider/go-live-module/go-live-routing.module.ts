import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderStreamingComponent } from './components';
import { ProviderDeactivateGuard } from '@sharedModule/guards';

const routes: Routes = [
  {
    path: '',
    component: ProviderStreamingComponent,
    canDeactivate: [ProviderDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoLiveRoutingModule {}
