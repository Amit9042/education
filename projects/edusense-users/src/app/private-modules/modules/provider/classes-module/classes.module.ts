import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassesRoutingModule } from './classes-routing.module';
import {
    ClassListComponent,
    ClassViewComponent,
    AddStudentDialogComponent,
    ClassDetailsDialogComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';


@NgModule({
    declarations: [
        ClassListComponent,
        ClassViewComponent,
        AddStudentDialogComponent,
        ClassDetailsDialogComponent
    ],
    imports: [CommonModule, SharedModule, ClassesRoutingModule],
    entryComponents: [AddStudentDialogComponent, ClassDetailsDialogComponent]
})
export class ClassesModule {}
