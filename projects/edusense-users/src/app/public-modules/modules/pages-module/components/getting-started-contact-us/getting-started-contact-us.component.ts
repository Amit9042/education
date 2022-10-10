import { Component, OnInit, Input } from '@angular/core';
import { RouteConstant } from '@sharedModule/constants';
import { Router } from '@angular/router';

@Component({
    selector: 'app-getting-started-contact-us',
    templateUrl: './getting-started-contact-us.component.html',
    styleUrls: ['./getting-started-contact-us.component.scss']
})
export class GettingStartedContactUsComponent implements OnInit {
    @Input() contactBtn;
    
    constructor(private router: Router,) {}

    ngOnInit(): void {}

    onContactUs(){
        this.router.navigate(['/' + RouteConstant.CONTACT_US]);
    }
}
