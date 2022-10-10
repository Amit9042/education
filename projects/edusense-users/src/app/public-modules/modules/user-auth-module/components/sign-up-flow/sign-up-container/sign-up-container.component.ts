import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';

export enum Views {
    SIGN_UP_TYPE,
    SIGN_UP_VIEW,
    OTP_VIEW
}

@Component({
    selector: 'app-sign-up-container',
    templateUrl: './sign-up-container.component.html',
    styleUrls: ['./sign-up-container.component.scss']
})
export class SignUpContainerComponent implements OnInit {
    // Enum Variables
    htmlView = Views;
    activeView: Views = this.htmlView.SIGN_UP_TYPE;

    // State variables
    emailAddress;

    constructor(private router: Router) {}

    ngOnInit() {}

    onGetData(event) {
        this.emailAddress = event;
    }

    onChangeView(flag: string) {
        switch (flag) {
            case 'sign-up-type':
                this.activeView = this.htmlView.SIGN_UP_TYPE;

            case 'sign-up':
                this.activeView = this.htmlView.SIGN_UP_VIEW;
                break;

            case 'otp':
                this.activeView = this.htmlView.OTP_VIEW;
                break;
        }
    }

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
