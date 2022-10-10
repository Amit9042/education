import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAuthRoutingModule } from './admin-auth-routing.module';
import { AdminLoginComponent, AdminLoginFormComponent } from './components';
import { UtilityLibModule } from 'utility-lib';

@NgModule({
    declarations: [AdminLoginComponent, AdminLoginFormComponent],
    imports: [
        CommonModule,
        UtilityLibModule.forRoot(),
        AdminAuthRoutingModule]
})

export class AdminAuthModule {}
