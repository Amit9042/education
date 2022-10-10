import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sharedModule/shared.module';
import { StudentMaterialRoutingModule } from './student-material-routing.module';
import { StudentMaterialListComponent, StudentSubjectSelectionComponent } from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [StudentMaterialListComponent, StudentSubjectSelectionComponent],
    imports: [
        CommonModule,
        SharedModule,
        InfiniteScrollModule,
        StudentMaterialRoutingModule
    ],
    entryComponents: []
})
export class StudentMaterialModule {}
