import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import {
    MaterialListComponent,
    MaterialViewComponent,
    AddMaterialDialogComponent,
    GradeSelectionComponent,
    SubjectSelectionComponent,
    MaterialSelectionComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
    declarations: [
        MaterialListComponent,
        MaterialViewComponent,
        AddMaterialDialogComponent,
        GradeSelectionComponent,
        SubjectSelectionComponent,
        MaterialSelectionComponent
    ],
    imports: [
        CommonModule,
        MaterialRoutingModule,
        InfiniteScrollModule,
        SharedModule
    ],
    entryComponents: [AddMaterialDialogComponent]
})
export class MaterialModule {}
