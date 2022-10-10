import { Component, OnInit } from '@angular/core';
import { RouteConstant } from '@sharedModule/constants';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    constructor() {}

    ngOnInit(): void {
        window.scrollTo(0, 0);
    }

    get privacyPolicyUrl() {
        return '/' + RouteConstant.PRIVACY_POLICY;
    }

    // get teamUrl() {
    //     return '/' + RouteConstant.TEAM;
    // }
}
