import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentAuthRoutingModule } from './student-auth-routing.module';
import { SharedModule } from '../../../shared-module/shared.module';
import {
    StudentSignUpContainerComponent,
    StudentSignUpComponent,
    StudentOtpComponent,
    StudentBuildProfileComponent,
    StudentForgotPasswordFlowContainerComponent,
    StudentForgotPasswordComponent,
    StudentResetPasswordComponent,
    StudentForgotOtpComponent
} from './components';

@NgModule({
    declarations: [
        StudentSignUpContainerComponent,
        StudentSignUpComponent,
        StudentOtpComponent,
        StudentBuildProfileComponent,
        StudentForgotPasswordFlowContainerComponent,
        StudentForgotPasswordComponent,
        StudentForgotOtpComponent,
        StudentResetPasswordComponent
    ],
    imports: [CommonModule, SharedModule, StudentAuthRoutingModule]
})
export class StudentAuthModule {}
