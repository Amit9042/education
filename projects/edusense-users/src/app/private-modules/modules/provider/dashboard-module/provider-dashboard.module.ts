import { SharedModule } from '@sharedModule/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        DashboardRoutingModule
    ]
})
export class ProviderDashboardModule {}
