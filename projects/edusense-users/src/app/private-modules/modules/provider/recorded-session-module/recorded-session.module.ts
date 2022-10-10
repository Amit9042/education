import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordedSessionRoutingModule } from './recorded-session-routing.module';
import {
    RecordedSessionListComponent,
    RecordedSessionViewComponent,
    RecordedSessionDetailsDialogComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        RecordedSessionListComponent,
        RecordedSessionViewComponent,
        RecordedSessionDetailsDialogComponent
    ],
    imports: [
        CommonModule,
        RecordedSessionRoutingModule,
        SharedModule,
        InfiniteScrollModule
    ],
    entryComponents: [RecordedSessionDetailsDialogComponent]
})
export class RecordedSessionModule {}
