import { SharedModule } from '@sharedModule/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEnrollmentStatusRoutingModule } from './student-enrollment-status-routing.module';
import { StudentEnrollmentstatusListComponent } from './components';


@NgModule({
  declarations: [StudentEnrollmentstatusListComponent],
  imports: [
    CommonModule,
    SharedModule,
    StudentEnrollmentStatusRoutingModule
  ]
})
export class StudentEnrollmentStatusModule { }
