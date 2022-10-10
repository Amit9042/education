import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import {
  RouteConstant,
  ValidationConstant,
  CommonRegexp,
  MIXPANEL_EVENTS
} from "@sharedModule/constants";
import { FormBaseComponent } from "@sharedModule/components";
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { ForgotPasswordService } from 'edusense-users/src/app/public-modules/services';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent extends FormBaseComponent
  implements OnInit {
  // Angular variables
  @Output() clickEvent = new EventEmitter<string>();

  // Form Group Variable
  forgotForm: FormGroup;

  // Constants variables
  validationMsg = new ValidationConstant();

  // State Variables
  showLoader = false;
  isShow = true;

  constructor(private router: Router, fb: FormBuilder,
    private _sharedService: SharedService,
    private _forgotPsswordService: ForgotPasswordService,
    private _mixpanelService:MixpanelService) {
    super(fb);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize = () => {
    this.createForgotForm();
  };

  // Create form
  createForgotForm = () => {
    this.forgotForm = this.createForm({
      email: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)
        ]
      ]
    });
  };

  onForgotFormSubmit = (form: FormGroup) => {
    if (this.onSubmit(form)) {
      this._forgotPsswordService.forgotPassword(form.value).subscribe(response => {
        this._sharedService.setVerificationToken(response.payload.token);
        this._sharedService.setSignupUserData(form.value.email);
        this.clickEvent.emit("otp");
        this._mixpanelService.track(
          MIXPANEL_EVENTS.FORGOT_PASSWORD,
          {email:form.value.email});
      })
    }
  };

  onBack() {
    this.router.navigate(["/" + RouteConstant.LOGIN]);
  }

  get formControls() {
    return this.forgotForm.controls;
  }
}
