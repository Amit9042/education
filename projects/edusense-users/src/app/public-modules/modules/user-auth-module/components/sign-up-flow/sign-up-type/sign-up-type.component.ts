import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import { Router } from '@angular/router';
import { RouteConstant, UserTypeEnum } from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'app-sign-up-type',
    templateUrl: './sign-up-type.component.html',
    styleUrls: ['./sign-up-type.component.scss']
})
export class SignUpTypeComponent extends FormBaseComponent implements OnInit {
    @Output() clickEvent = new EventEmitter<string>();

    signUpTypeForm: FormGroup;
    signUpTypeEnum = UserTypeEnum;
    signUpType = UserTypeEnum.PROVIDER;
    isTypeProvider: boolean;

    constructor(
        _fb: FormBuilder,
        private router: Router,
        private _sharedService: SharedService
    ) {
        super(_fb);
    }

    ngOnInit() {
        const signuptype = this._sharedService.getSignupType();
        if (signuptype && signuptype === this.signUpTypeEnum.STUDENT) {
            this.isTypeProvider = false;
            this.signUpType = this.signUpTypeEnum.STUDENT;
        } else {
            this.isTypeProvider = true;
            this.signUpType = this.signUpTypeEnum.PROVIDER;
        }
    }

    onSignUpTypeChange = (value) => {
        this.signUpType = +value.target.value;
        this.isTypeProvider = !this.isTypeProvider;
    };

    onSelectSignUpType = () => {
        if (this.signUpType === this.signUpTypeEnum.PROVIDER) {
            this.isTypeProvider = true;
            this.router.navigate(['/' + RouteConstant.SIGN_UP]);
            this.clickEvent.emit('sign-up');
        } else {
            this.isTypeProvider = false;
            this.router.navigate(['/' + RouteConstant.STUDENT_SIGN_UP]);
        }
    };

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
