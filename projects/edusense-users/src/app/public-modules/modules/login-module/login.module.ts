import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginRoutingModule } from "./login-routing.module";
import {
  LoginContainerComponent,
  ProviderLoginComponent,
  StudentLoginComponent,
} from "./components";
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
  declarations: [
    LoginContainerComponent,
    ProviderLoginComponent,
    StudentLoginComponent,
  ],
  imports: [CommonModule, LoginRoutingModule, SharedModule],
})
export class LoginModule {}
