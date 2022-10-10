import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GoLiveRoutingModule } from "./go-live-routing.module";
import {
  ProviderStreamingComponent,
  ChatComponent,
  RaiseRequestComponent,
} from "./components";
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
  declarations: [ProviderStreamingComponent, ChatComponent, RaiseRequestComponent],
  imports: [CommonModule, SharedModule, GoLiveRoutingModule],
  entryComponents: [RaiseRequestComponent],
})
export class GoLiveModule {}
