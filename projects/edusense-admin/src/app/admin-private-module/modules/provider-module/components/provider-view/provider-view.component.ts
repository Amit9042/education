import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminRouteConstant } from 'edusense-admin/src/app/_shared/constants';

@Component({
  selector: 'es-admin-provider-view',
  templateUrl: './provider-view.component.html',
  styleUrls: ['./provider-view.component.scss']
})
export class ProviderViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onProviderList() {
    this.router.navigate(['/' + AdminRouteConstant.PROVIDER_LIST]);
}

}
