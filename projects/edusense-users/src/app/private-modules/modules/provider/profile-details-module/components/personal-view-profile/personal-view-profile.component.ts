import { Component, OnInit } from '@angular/core';
import { SharedUserService } from '@sharedModule/services';

@Component({
  selector: 'app-personal-view-profile',
  templateUrl: './personal-view-profile.component.html',
  styleUrls: ['./personal-view-profile.component.scss']
})
export class PersonalViewProfileComponent implements OnInit {

  userData = null;

  constructor(private _sharedUserService: SharedUserService) { }

  ngOnInit() {
    this.userData = this._sharedUserService.getUser();
  }

}
