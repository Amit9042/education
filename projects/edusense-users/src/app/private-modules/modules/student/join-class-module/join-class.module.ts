import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinClassRoutingModule } from './join-class-routing.module';
import { SharedModule } from '@sharedModule/shared.module';
import { StudentStreamingComponent, StudentWaitingScreenComponent } from './components';
@NgModule({
  declarations: [StudentStreamingComponent, StudentWaitingScreenComponent],
  imports: [CommonModule, SharedModule, JoinClassRoutingModule],
})
export class JoinClassModule {}
