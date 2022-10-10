import { Component, OnInit } from '@angular/core';
import { RouteConstant, MIXPANEL_EVENTS } from '@sharedModule/constants';
import { Router } from '@angular/router';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';

@Component({
  selector: 'app-role-management-view',
  templateUrl: './role-management-view.component.html',
  styleUrls: ['./role-management-view.component.scss']
})
export class RoleManagementViewComponent implements OnInit {

  constructor(private router: Router,private _mixpanelService:MixpanelService) { }

  ngOnInit(): void {
    this._mixpanelService.track(MIXPANEL_EVENTS.ROLE_MANAG_DETAIL, {});
  }

  onRoleManagementList = () => {
    this.router.navigate(['/' + RouteConstant.ROLE_MANAGEMENT_LIST]);
};

}
