import {
    ClassAttendanceListComponent,
    classAttendanceViewComponent
} from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassAttendanceRoutingModule } from './class-attendance-routing.module';
import { SharedModule } from '@sharedModule/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SesstionHistoryDialogComponent } from './components/sesstion-history-dialog/sesstion-history-dialog.component';

@NgModule({
    declarations: [
        ClassAttendanceListComponent,
        classAttendanceViewComponent,
        SesstionHistoryDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ClassAttendanceRoutingModule,
        InfiniteScrollModule
    ],
    entryComponents: [SesstionHistoryDialogComponent]
})
export class ClassAttendanceModule {}
