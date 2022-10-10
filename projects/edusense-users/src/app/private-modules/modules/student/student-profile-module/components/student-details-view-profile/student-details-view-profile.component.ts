import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-student-details-view-profile',
    templateUrl: './student-details-view-profile.component.html',
    styleUrls: ['./student-details-view-profile.component.scss']
})
export class StudentDetailsViewProfileComponent implements OnInit {
    @Input() profileDetail;
    constructor() {}

    ngOnInit() {}

    getLocatiton = () => {
        return `${this.profileDetail.student_city.city_name}, ${this.profileDetail.student_state.state_name}
            , ${this.profileDetail.student_country.country_name}`;
    };
}
