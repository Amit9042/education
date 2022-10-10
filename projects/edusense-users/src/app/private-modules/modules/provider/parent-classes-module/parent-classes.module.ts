import { SharedModule } from '@sharedModule/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentClassesRoutingModule } from './parent-classes-routing.module';
import {
    ParentClassesListComponent,
    ParentClassesViewComponent,
    ParentClassesDetailsDialogComponent
} from './components';

@NgModule({
    declarations: [
        ParentClassesListComponent,
        ParentClassesViewComponent,
        ParentClassesDetailsDialogComponent
    ],
    imports: [
        CommonModule, 
        SharedModule,
        ParentClassesRoutingModule]
})

export class ParentClassesModule {}
