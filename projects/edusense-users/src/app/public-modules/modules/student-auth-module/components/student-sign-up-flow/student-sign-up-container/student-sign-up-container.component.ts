import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';

export enum Views {
    SIGN_UP_VIEW,
    OTP_VIEW
}
@Component({
    selector: 'app-student-sign-up-container',
    templateUrl: './student-sign-up-container.component.html',
    styleUrls: ['./student-sign-up-container.component.scss']
})
export class StudentSignUpContainerComponent implements OnInit {
    // Enum Variables
    htmlView = Views;
    activeView: Views = this.htmlView.SIGN_UP_VIEW;

    // State variables
    emailAddress;

    constructor(private router: Router) {}

    ngOnInit() {}

    onGetData(event) {
        this.emailAddress = event;
    }

    onChangeView(flag: string) {
        switch (flag) {
            case 'student-signup':
                this.activeView = this.htmlView.SIGN_UP_VIEW;
                break;

            case 'student-otp':
                this.activeView = this.htmlView.OTP_VIEW;
                break;
        }
    }

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
