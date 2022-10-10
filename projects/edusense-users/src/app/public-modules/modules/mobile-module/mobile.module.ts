import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileStreamingComponent } from './components/streaming/mobile-streaming.component';
import {MobileRoutingModule} from './mobile-routing.module';
import {SharedModule} from '@sharedModule/shared.module';

@NgModule({
  declarations: [MobileStreamingComponent],
  imports: [
    CommonModule,
    SharedModule,
    MobileRoutingModule
  ]
})
export class MobileModule { }
