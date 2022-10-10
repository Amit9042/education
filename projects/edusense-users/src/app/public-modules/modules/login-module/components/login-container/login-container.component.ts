import { Component, OnInit } from '@angular/core';
import { UserTypeEnum } from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
@Component({
    selector: 'app-login-container',
    templateUrl: './login-container.component.html',
    styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent implements OnInit {
    loginType = UserTypeEnum;
    isProvider = true;

    constructor(
        private _sharedService: SharedService,
        private router: Router
    ) {}

    ngOnInit() {
        this._sharedService.setSignupType(this.loginType.PROVIDER);
    }

    tabClick(tab) {
        if (tab.index === 1) {
            this._sharedService.setSignupType(this.loginType.STUDENT);
        } else {
            this._sharedService.setSignupType(this.loginType.PROVIDER);
        }
        this.isProvider = !this.isProvider;
    }

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
