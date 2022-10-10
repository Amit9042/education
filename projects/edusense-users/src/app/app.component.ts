import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
    ChildHeaderRoutes,
    PubnubService,
    SharedService,
    SharedUserService,
    SvgIconsService,
    UserTypeEnum
} from './shared-module';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RouteHistoryService } from '@sharedModule/services/route-history';
import { EnterpriseDetail, UserConfigModel } from './public-modules/models';
import { StudentAutenticationService } from './public-modules/services';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    // Data variables
    userType = UserTypeEnum;
    userConfig: UserConfigModel = null;

    // State variables
    isLoggedIn = false;
    showLoader = false;
    panelMove = true;

    // Observable variables
    loggedInStatusSubscriber$: any;
    snackBarSubscriber$: any;
    loaderSubscriber$: any;

    // child header show/hide
    hideChildHeader = false;

    constructor(
        public svgService: SvgIconsService,
        private sharedService: SharedService,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
        protected pubnubService: PubnubService,
        private _routerHistoryService: RouteHistoryService,
        private _studentService: StudentAutenticationService,
        private _sharedUserService: SharedUserService,
        private router: Router
    ) {
        _routerHistoryService.initialize();
    }

    ngOnInit() {
        this.initalize();
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
        this.pubnubService.unsubscribeChannels();
    }

    initalize = () => {
        this.svgService.registerIcons();
        this.subscribeLoggedInStatus();
        this.subscribeLoader();
        this.subscribeSnackbar();
        this._sharedUserService.setConfigDetailCall(true);
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd){
            this.hideChildHeader = ChildHeaderRoutes.indexOf(event.url) > -1;
          }
        });
    };

    subscribeLoggedInStatus = () => {
        this.loggedInStatusSubscriber$ = this.sharedService
            .getLoggedInUserStatus()
            .subscribe((value) => {
                this.isLoggedIn = value;
                if (this.isLoggedIn) {
                    this.userConfig = this.sharedService.getUserConfig();
                    const userDetail = this.sharedService.getUserConfig();
                    const commonChannel = `${userDetail.user_id}__${userDetail['user_role_link.role_id']}__${userDetail.user_uuid}`;
                    const channels = [commonChannel];
                    if (userDetail.app_id === UserTypeEnum.STUDENT) {
                        const privateChannel = `${commonChannel}__${
                            this.sharedService.getActiveEnterprise()
                                .provider_uuid
                        }`;
                        channels.push(privateChannel);
                    }
                    this.pubnubService.subscribeChannels(channels);
                } else {
                    this.pubnubService.unsubscribeChannels();
                }
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
