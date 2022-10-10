import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { AdminRouteConstant } from '../../_shared/constants';
import { SharedService } from 'utility-lib';

@Component({
    selector: 'es-admin-admin-navbar',
    templateUrl: './admin-navbar.component.html',
    styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
    // Input and Ouptut methods
    @Output() menuClick = new EventEmitter<boolean>();
    @ViewChild('notificationNav', { static: true }) notificationNav;
    @ViewChild('settingNav', { static: true }) settingNav;

    // State Variables
    isShowMenu = true;
    isShowDropdown = false;
    isNotificationSlider = false;

    mediaQuery = window.matchMedia('(min-width: 320px) and (max-width: 767px)');

    constructor(private sharedService: SharedService) {}

    ngOnInit(): void {}

    onSidebarCollapse = () => {
        this.isShowMenu = !this.isShowMenu;
        this.menuClick.emit(this.isShowMenu);
    };

    onShowDropdown = () => {
        this.settingNav.close();
        this.notificationNav.close();
        this.isShowDropdown = true;
        setTimeout(() => {
            this.isNotificationSlider = false;
        }, 1000);
    };

    onHideDropdown = () => {
        this.settingNav.close();
        this.notificationNav.close();
        this.isShowDropdown = false;
        setTimeout(() => {
            this.isNotificationSlider = false;
        }, 1000);
    };

    onCloseNav() {
        if (this.mediaQuery.matches) {
            this.isShowMenu = true;
        }
    }

    onOpenViews(flag) {
        switch (flag) {
            case 'notification':
                this.onNotificationShow();
                this.isShowDropdown = false;
                break;
            case 'settings':
                this.notificationNav.close();
                this.settingNav.toggle();
                this.isShowDropdown = false;
                break;
        }
    }

    onNotificationShow = () => {
        if (this.notificationNav.opened) {
            this.notificationNav.close();
            setTimeout(() => {
                this.isNotificationSlider = false;
            }, 1000);
        } else {
            this.settingNav.close();
            this.notificationNav.open();
            this.isNotificationSlider = true;
        }
    };

    onClickOutSide() {
        this.settingNav.close();
        this.notificationNav.close();
        this.isShowDropdown = false;
        setTimeout(() => {
            this.isNotificationSlider = false;
        }, 1000);
    }

    onLogOut = () => {
        // this._mixpanelService.track(
        //     this.userConfig.app_id === this.userType.STUDENT
        //         ? MIXPANEL_EVENTS.SINGOUT_STUD
        //         : MIXPANEL_EVENTS.SINGOUT,
        //     {}
        // );
        // this._mixpanelService.isInitialized = false;
        // this._mixpanelService.reset();
        this.sharedService.logout();
    };

    get providerUrl() {
        return '/' + AdminRouteConstant.PROVIDER_MODULE_ROUTE;
    }

    get broadcastUrl() {
        return '/' + AdminRouteConstant.BROADCAST_MODULE;
    }
}
