import { Component, OnInit } from '@angular/core';
import { SharedUserService } from '@sharedModule/services';

@Component({
    selector: 'app-provider-view-profile',
    templateUrl: './provider-view-profile.component.html',
    styleUrls: ['./provider-view-profile.component.scss']
})
export class ProviderViewProfileComponent implements OnInit {
    userData = null;

    constructor(private _sharedUserService: SharedUserService) {}

    ngOnInit() {
        this.userData = this._sharedUserService.getUser();
    }

    getBoard = () => {
        if (this.userData) {
            let board = []
            this.userData.provider_boards.forEach(element => {
                board.push(element.board.name);
            });
            return board.join(', ');
        } else {
            return '-';
        }
    }

    getMedium = () => {
        if (this.userData) {
            let medium = []
            this.userData.provider_mediums.forEach(element => {
                medium.push(element.medium.name);
            });
            return medium.join(', ');
        } else {
            return '-';
        }
    }

    getSubjects = () => {
        if (this.userData) {
            let subject = []
            this.userData.provider_subjects.forEach(element => {
                subject.push(element.subject.name);
            });
            return subject.join(', ');
        } else {
            return '-';
        }
    }

    getLocation = () => {
      if (this.userData) {
        if (this.userData.address !== '') {
            return `${this.userData.address},  ${this.userData.city.city_name}, ${this.userData.state.state_name}, ${this.userData.country.country_name}`;
        } else {
            return `${this.userData.city.city_name}, ${this.userData.state.state_name}, ${this.userData.country.country_name}`;
        }
      } else {
        return '-';
      }
    };
}
