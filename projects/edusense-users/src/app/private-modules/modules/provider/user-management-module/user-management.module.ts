import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import {
    InviteUserDialogComponent,
    EditUserDialogComponent,
    UserManagementListComponent,
    UserManagementViewComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
    declarations: [
        InviteUserDialogComponent,
        EditUserDialogComponent,
        UserManagementListComponent,
        UserManagementViewComponent
    ],
    imports: [CommonModule,SharedModule, UserManagementRoutingModule],
    entryComponents: [EditUserDialogComponent, InviteUserDialogComponent]
})
export class UserManagementModule {}
