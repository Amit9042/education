import { SharedModule } from './../../../../shared-module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRecordedSessionRoutingModule } from './student-recorded-session-routing.module';
import {
    StudentRecordedListComponent,
    StudentRecordedViewComponent
} from './components';

@NgModule({
    declarations: [StudentRecordedListComponent, StudentRecordedViewComponent],
    imports: [
        CommonModule, 
        SharedModule,
        StudentRecordedSessionRoutingModule]
})

export class StudentRecordedSessionModule {}
