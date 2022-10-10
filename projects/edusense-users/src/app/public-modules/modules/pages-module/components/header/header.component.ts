import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouteConstant } from '@sharedModule/constants';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    // State variables
    isActiveHome = false;

    constructor(private _router: Router) {
        if (this._router.url === '/') {
            this.isActiveHome = true;
        } else {
            this.isActiveHome = false;
        }
    }

    ngOnInit(): void {
        window.scrollTo(0, 0);
    }

    onHomePage() {
        this._router.navigate(['/' + RouteConstant.HOME]);
        this.isActiveHome = true;
    }

    get homeUrl() {
        return '/' + RouteConstant.HOME;
    }

    get studentUrl() {
        return '/' + RouteConstant.STUDENTS;
    }

    get providerUrl() {
        return '/' + RouteConstant.PROVIDERS;
    }

    get aboutUsUrl() {
        return '/' + RouteConstant.ABOUT_US;
    }

    get signUpUrl() {
        return '/' + RouteConstant.SIGN_UP;
    }

    get loginUrl() {
        return '/' + RouteConstant.LOGIN;
    }

    get contactUsUrl() {
        return '/' + RouteConstant.CONTACT_US;
    }
}
