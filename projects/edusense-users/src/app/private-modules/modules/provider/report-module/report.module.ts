import { SharedModule } from '@sharedModule/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
