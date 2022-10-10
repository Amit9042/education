import { SharedModule } from '@sharedModule/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentDashboardComponent } from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    declarations: [StudentDashboardComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        DashboardRoutingModule
    ]
})
export class StudentDashboardModule {}
