import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrolmentRequestRoutingModule } from './enrolment-request-routing.module';
import {
    AssignEnrollmentRequestDialogComponent,
    EnrolmentRequestListComponent,
    EnrollmentRequestStudentViewDialogComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
    declarations: [
        EnrolmentRequestListComponent,
        AssignEnrollmentRequestDialogComponent,
        EnrollmentRequestStudentViewDialogComponent
    ],
    imports: [CommonModule, SharedModule, EnrolmentRequestRoutingModule],
    entryComponents: [AssignEnrollmentRequestDialogComponent]
})
export class EnrolmentRequestModule {}
