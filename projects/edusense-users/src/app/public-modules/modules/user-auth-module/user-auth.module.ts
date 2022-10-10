import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserAuthRoutingModule } from "./user-auth-routing.module";
import {
  SignupComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  OtpComponent,
  SignUpContainerComponent,
  SignUpTypeComponent,
  BuildProfileComponent,
  PersonalInfoComponent,
} from "./components";
import { SharedModule } from "@sharedModule/shared.module";
import { ForgotOtpComponent } from './components/forgot-password-flow/forgot-otp/forgot-otp.component';
import { ForgotPasswordFlowContainerComponent } from './components/forgot-password-flow/forgot-password-flow-container/forgot-password-flow-container.component';

@NgModule({
  declarations: [
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ForgotOtpComponent,
    OtpComponent,
    ForgotPasswordFlowContainerComponent,
    SignUpContainerComponent,
    SignUpTypeComponent,
    BuildProfileComponent,
    PersonalInfoComponent,
  ],
  imports: [CommonModule, SharedModule, UserAuthRoutingModule],
})
export class UserAuthModule {}
