
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { RoleManagementListComponent, RoleManagementViewComponent } from './components';
import { SharedModule } from '../../../../shared-module/shared.module';


@NgModule({
  declarations: [RoleManagementListComponent, RoleManagementViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RoleManagementRoutingModule
  ]
})
export class RoleManagementModule { }
