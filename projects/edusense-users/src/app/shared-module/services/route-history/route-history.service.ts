import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RouteHistoryService {

    private previousUrl = '';
    private currentUrl = '';

    constructor(private router: Router) {
    }

    initialize(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(({urlAfterRedirects}: NavigationEnd) => {
                if (this.currentUrl) {
                    this.previousUrl = this.currentUrl;
                }
                this.currentUrl = urlAfterRedirects;
            });
    }

    getPreviousUrl(): string {
        return this.previousUrl;
    }

    getCurrentUrl(): string {
        return this.currentUrl;
    }
}
