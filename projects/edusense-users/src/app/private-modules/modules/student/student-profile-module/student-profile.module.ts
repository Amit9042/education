import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentProfileRoutingModule } from './student-profile-routing.module';
import {
    StudentViewProfileContainerComponent,
    StudentEditProfileContainerComponent,
    StudentDetailsViewProfileComponent,
    StudentDetailsEditProfileComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
    declarations: [
        StudentViewProfileContainerComponent,
        StudentEditProfileContainerComponent,
        StudentDetailsViewProfileComponent,
        StudentDetailsEditProfileComponent
    ],
    imports: [CommonModule, SharedModule, StudentProfileRoutingModule]
})
export class StudentProfileModule {}
