import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';

export enum Flow_view {
    EMAIL_VIEW,
    OTP_VIEW,
    NEW_PASSWORD_VIEW
}

@Component({
    selector: 'app-student-forgot-password-flow-container',
    templateUrl: './student-forgot-password-flow-container.component.html',
    styleUrls: ['./student-forgot-password-flow-container.component.scss']
})
export class StudentForgotPasswordFlowContainerComponent implements OnInit {
    // Enum Variables
    htmlView = Flow_view;
    activeView: Flow_view = this.htmlView.EMAIL_VIEW;

    // State variables
    emailAddress;

    constructor(private router: Router) {}

    ngOnInit() {}

    onGetData(event) {
        this.emailAddress = event;
    }

    onChangeView(flag: string) {
        switch (flag) {
            case 'email':
                this.activeView = this.htmlView.EMAIL_VIEW;
                break;

            case 'student-otp':
                this.activeView = this.htmlView.OTP_VIEW;
                break;

            case 'new-password':
                this.activeView = this.htmlView.NEW_PASSWORD_VIEW;
                break;
        }
    }

    onHomePageUrl = () => {
        this.router.navigate(['/' + RouteConstant.HOME]);
    };
}
