import { Component, OnInit } from '@angular/core';
import { SharedUserService } from '@sharedModule/services';

@Component({
  selector: 'app-personal-view-profile-other',
  templateUrl: './personal-view-profile-other.component.html',
  styleUrls: ['./personal-view-profile-other.component.scss']
})
export class PersonalViewProfileOtherComponent implements OnInit {

  userData = null;

  constructor(private _sharedUserService: SharedUserService) { }

  ngOnInit() {
    this.userData = this._sharedUserService.getUser();
  }

}

