import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormBaseComponent } from "@sharedModule/components";
import { ValidationConstant, CommonRegexp, MIXPANEL_EVENTS } from "@sharedModule/constants";
import { SharedService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { ForgotPasswordService } from 'edusense-users/src/app/public-modules/services';

@Component({
  selector: "app-forgot-otp",
  templateUrl: "./forgot-otp.component.html",
  styleUrls: ["./forgot-otp.component.scss"],
})
export class ForgotOtpComponent extends FormBaseComponent implements OnInit {
  // Angular variables
  @Output() clickEvent = new EventEmitter<string>();
  @Input() email;
  @Input() resendParams = null;
  @ViewChild("inputRef1", { static: true }) inputRef1;
  @ViewChild("inputRef2", { static: true }) inputRef2;
  @ViewChild("inputRef3", { static: true }) inputRef3;
  @ViewChild("inputRef4", { static: true }) inputRef4;
  @ViewChild("inputRef5", { static: true }) inputRef5;
  @ViewChild("inputRef6", { static: true }) inputRef6;

  // Form Group Variable
  otpForm: FormGroup;

  // Constants variables
  validationMsg = new ValidationConstant();

  showResendOTPButton = true;
  clockDisplay: string;
  interval: any;
  duration: number;
  otptimeOut: number;

  constructor(fb: FormBuilder,
      private _sharedService: SharedService,
      private _forgotPasswordService: ForgotPasswordService,
      private _mixpanelService:MixpanelService) {
    super(fb);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize = () => {
    this.createOtpForm();
    this.setTimerValue();
  };

  createOtpForm = () => {
    this.otpForm = this.createForm({
      otpInput1: [
        "",
        [
          Validators.required,
          Validators.pattern(CommonRegexp.NUMERIC_REGEXP),
        ],
      ],
      otpInput2: [
        "",
        [
          Validators.required,
          Validators.pattern(CommonRegexp.NUMERIC_REGEXP),
        ],
      ],
      otpInput3: [
        "",
        [
          Validators.required,
          Validators.pattern(CommonRegexp.NUMERIC_REGEXP),
        ],
      ],
      otpInput4: [
        "",
        [
          Validators.required,
          Validators.pattern(CommonRegexp.NUMERIC_REGEXP),
        ],
      ],
      otpInput5: [
        "",
        [
          Validators.required,
          Validators.pattern(CommonRegexp.NUMERIC_REGEXP),
        ],
      ],
      otpInput6: [
        "",
        [
          Validators.required,
          Validators.pattern(CommonRegexp.NUMERIC_REGEXP),
        ],
      ],
    });
    // setTimeout(() => {
    //   this.inputRef1.nativeElement.focus();
    // }, 100);
  };

  setTimerValue = () => {
    this.otptimeOut = 3; // set 3 minute timeout
    if (this.otptimeOut > 0) {
      this.duration = 60 * +this.otptimeOut;
      this.showResendOTPButton = false;
      this.startTimer(this.duration);
    } else {
      this.showResendOTPButton = true;
    }
  };

  /**
   * Field Blur Event
   */
  onBlurInput(event, currentRef, nextRef) {
    if (event.keyCode === 16) {
      event.preventDefault();
    } else if (
      event.keyCode === 37 ||
      event.keyCode === 38 ||
      event.keyCode === 39 ||
      event.keyCode === 40
    ) {
      this.onFocus(currentRef);
    } else {
      if (nextRef) {
        setTimeout(() => {
          nextRef.focus();
        }, 1);
      }
    }
  }

  /**
   * Field Focus Event
   */
  onFocus(currentRef) {
    const originalValue = currentRef.value;
    currentRef.value = "";
    currentRef.blur();
    currentRef.focus();
    currentRef.value = originalValue;
  }

  onOtpFormSubmit = (form: FormGroup) => {
    if (this.onSubmit(form)) {
      const params = { ...form.value };
      const requestParams = {};
      let otp = "";
      for (const key in params) {
        otp += params[key];
      }
      requestParams["token"] = this._sharedService.getVerificationToken();
      requestParams["otp"] = +otp;
      this._forgotPasswordService.verifyForgotPasswordOtp(requestParams).subscribe(response => {
        this._sharedService.setVerificationToken(response.payload.token);
        this.clickEvent.emit("new-password");
        this._mixpanelService.track(
          MIXPANEL_EVENTS.FORGOT_PASSWORD_VERIFY,
          {email:this.email});
      })
    }
  };

  startTimer(duration: number) {
    if (duration > 0) {
      let timer: number = +duration;
      let minutes: any;
      let seconds: any;
      const self = this;
      self.interval = setInterval(function () {
        if (timer < 0) {
          clearInterval(self.interval);
          self.showResendOTPButton = true;
          self.clockDisplay = "";
        }
        minutes = Math.floor(timer / 60);
        seconds = Math.floor(timer % 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        self.clockDisplay = minutes + ":" + seconds;
        if (--timer < 0) {
          self.showResendOTPButton = true;
          self.clockDisplay = "";
          clearInterval(self.interval);
        }
      }, 1000);
    }
  }

  onResendOTP() {
    const params = { token: this._sharedService.getVerificationToken() };
    this._forgotPasswordService.resendForgotPasswordOtp(params).subscribe(res => {
      this._sharedService.setVerificationToken(res.payload.token);
      this.showResendOTPButton = false;
      this.setTimerValue();
    });
  }

  onPasteEvent(event: ClipboardEvent) {
    const clipboardData = event.clipboardData; // || window.clipboardData
    const pastedText = clipboardData.getData("text");
    const arry = pastedText.split("");

    for (let i = 0; i < arry.length; i++) {
      this.otpForm.get("otpInput" + (i + 1)).setValue(arry[i]);
    }
    this.inputRef6.nativeElement.focus();
  }

  get formControls() {
    return this.otpForm.controls;
  }

  onBack = () => {
    this.clickEvent.emit("email");
    // this.location.back();
  };
}
