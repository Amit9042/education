import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidationConstant, CommonRegexp } from "@sharedModule/constants";
import { FormBaseComponent } from "@sharedModule/components";
import { SharedService } from '@sharedModule/services';
import { UserTypeEnum } from '@sharedModule/constants';
import { StudentAutenticationService, AuthenticationService } from '../../public-modules/services';

@Component({
  selector: "app-change-password-dialog",
  templateUrl: "./change-password-dialog.component.html",
  styleUrls: ["./change-password-dialog.component.scss"],
})
export class ChangePasswordDialogComponent extends FormBaseComponent
  implements OnInit {
  // Form Group Variable
  changePasswordForm: FormGroup;

  // Constants variables
  validationMsg = new ValidationConstant();
  userType = UserTypeEnum;

  // State Variables
  hide = true;
  showLoader = false;
  oldPassword = true;
  newPassword = true;
  confirmPassword = true;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sharedService: SharedService,
    private _providerAuthService: AuthenticationService,
    private _studentAuthService: StudentAutenticationService) {
    super(fb);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize = () => {
    this.createResetPassworForm();
  };

  createResetPassworForm = () => {
    this.changePasswordForm = this.createForm(
      {
        currentPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],

        newPassword: [
          "",
          [
            <any>Validators.required,
            <any>Validators.minLength(6),
            <any>Validators.maxLength(50),
          ],
        ],

        confirmPassword: ["", [<any>Validators.required]],
      },
      { validator: this.validate }
    );
  };

  onSubmitChangePassword = (form: FormGroup) => {
    const config = this._sharedService.getUserConfig();
    if (this.onSubmit(form)) {
      if (config && config.app_id === this.userType.PROVIDER) {
        this.changeProviderPassword(form.value);
      } else if (config && config.app_id === this.userType.STUDENT) {
        this.changeStudentPassword(form.value);
      }
    }
  };

  changeProviderPassword = (params) => {
    delete params['confirmPassword'];
    this._providerAuthService.changePassword(params).subscribe(response => {
      this.onCancel();
    });
  }

  changeStudentPassword = (params) => {
    delete params['confirmPassword'];
    this._studentAuthService.changeStudentPassword(params).subscribe(response => {
      this.onCancel();
    });
  }

  validate(changePasswordFormGroup: FormGroup) {
    const password = changePasswordFormGroup.controls.newPassword;
    const repeatPassword = changePasswordFormGroup.controls.confirmPassword;
    if (repeatPassword.value.length <= 0) {
      return null;
    }
    if (password.value.length === 0) {
      return null;
    }
    if (repeatPassword.value !== password.value) {
      repeatPassword.setErrors({ incorrect: true });
      return {
        doesMatchPassword: true,
      };
    } else {
      repeatPassword.setErrors(null);
    }
    return null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get formControls() {
    return this.changePasswordForm.controls;
  }
}
