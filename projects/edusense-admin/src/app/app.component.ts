import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AdminSvgIconsService } from 'edusense-admin/src/app/services/admin-svg-icons.service';
import { SharedService } from 'utility-lib';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    // State Varialbes
    panelMove = true;
    isLoggedIn = false;
    showLoader = false;

    // Observable variables
    loggedInStatusSubscriber$: any;
    snackBarSubscriber$: any;
    loaderSubscriber$: any;

    title = 'edusense-admin';
    constructor(public adminSvgService: AdminSvgIconsService,
        private sharedService: SharedService,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.initialize();
    }

    ngOnDestroy(): void {
        if (this.snackBarSubscriber$) {
            this.snackBarSubscriber$.unsubscribe();
        }
        if (this.loaderSubscriber$) {
            this.loaderSubscriber$.unsubscribe();
        }
        if (this.loggedInStatusSubscriber$) {
            this.loggedInStatusSubscriber$.unsubscribe();
        }
        // this.pubnubService.unsubscribeChannels();
    }

    initialize = () => {
        this.adminSvgService.registerIcons();
        this.subscribeLoggedInStatus();
        this.subscribeLoader();
        this.subscribeSnackbar();
    };

    subscribeLoggedInStatus = () => {
        this.loggedInStatusSubscriber$ = this.sharedService
            .getLoggedInUserStatus()
            .subscribe((value) => {
                this.isLoggedIn = value;
                // if (this.isLoggedIn) {
                //     const userDetail = this.sharedService.getUserConfig();
                //     const channelName = `${userDetail.user_id}__${userDetail.app_id}__${userDetail.user_uuid}`;
                //     this.pubnubService.subscribeChannels([channelName]);
                // } else {
                //     this.pubnubService.unsubscribeChannels();
                // }
            });
    };

    subscribeSnackbar = () => {
        this.snackBarSubscriber$ = this.sharedService
            .getSnackBar()
            .subscribe((message) => {
                if (message) {
                    this.openSnackBar(message);
                }
            });
    };

    subscribeLoader = () => {
        this.loaderSubscriber$ = this.sharedService
            .getLoader()
            .subscribe((flag) => {
                this.showLoader = flag;
                this.cdr.detectChanges();
            });
    };

    openSnackBar(message: string) {
        const configSnackBar = new MatSnackBarConfig();
        configSnackBar.verticalPosition = 'bottom';
        configSnackBar.horizontalPosition = 'left';
        configSnackBar.duration = 1500;
        configSnackBar.panelClass = ['white-snackbar'];
        this.snackBar.open(message, 'Close', configSnackBar);
    }

    onActivate(event) {
        window.scrollTo(0, 0);
    }
}
