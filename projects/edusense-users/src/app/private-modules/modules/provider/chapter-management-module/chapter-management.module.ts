import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sharedModule/shared.module';

import { ChapterManagementRoutingModule } from './chapter-management-routing.module';
import {
    ChapterManagementListComponent,
    ChapterManagementViewComponent
} from './components';
import { CreateChapterDetailsComponent } from './components/create-chapter-details/create-chapter-details.component';

@NgModule({
    declarations: [
        ChapterManagementListComponent,
        CreateChapterDetailsComponent,
        ChapterManagementViewComponent
    ],
    imports: [CommonModule, SharedModule, ChapterManagementRoutingModule],
    entryComponents: [CreateChapterDetailsComponent]
})
export class ChapterManagementModule {}
