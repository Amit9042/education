import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import {ProviderStreamingComponent} from '../../../private-modules/modules/provider/go-live-module/components';

@Injectable({
  providedIn: 'root'
})
export class ProviderDeactivateGuard implements CanDeactivate<ProviderStreamingComponent> {
  canDeactivate(component: ProviderStreamingComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
