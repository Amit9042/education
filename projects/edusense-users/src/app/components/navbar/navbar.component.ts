import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    ApplicationApi,
    MIXPANEL_EVENTS,
    RoleMaster,
    RouteConstant,
    UploadStatus,
    UserTypeEnum
} from '@sharedModule/constants';
import { userAllowed } from '@sharedModule/functions';
import { PubnubService } from '@sharedModule/pubnub';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { MaterialService } from '../../private-modules/modules/provider/material-module/service';
import {
    NotificationService,
    ProviderRecordingService
} from '../../private-modules/services';
import {
    EnterpriseDetail,
    Provider,
    UserConfigModel
} from '../../public-modules/models';
import { AuthenticationService } from '../../public-modules/services';
import { ClassesListDialogComponent } from '../classes-list-dialog/classes-list-dialog.component';
import { StudentEnrollDialogComponent } from '../student-enroll-dialog/student-enroll-dialog.component';
import { StudentJoinClassDialogComponent } from '../student-join-class-dialog/student-join-class-dialog.component';

interface UploadFile {
    data: Object;
    status: UploadStatus;
    percentage: number;
    fileNames: string;
    isMaterial: boolean;
}

export enum ViewsEnum {
    REPORT
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    // Data variables
    readonly htmlView = ViewsEnum;
    activeView: ViewsEnum = null;

    // User Type
    userType = UserTypeEnum;
    uploadStatus = UploadStatus;
    userConfig: UserConfigModel = null;
    provider: Provider = null;
    routeConstant = RouteConstant;

    // Input and Ouptut methods
    @Output() menuClick = new EventEmitter<boolean>();
    @ViewChild('notificationNav', { static: true }) notificationNav;
    @ViewChild('settingNav', { static: true }) settingNav;

    userDetailSub$;
    materialUploadSub$;

    // data Variables
    userDetail: any;
    userName: any;
    imageUploadUrl = '';
    currentRoute: string = '';

    // State Variables
    isShowMenu = true;
    isShowDropdown = false;
    isDialogOpen = false;
    isJoinClassDialogOpen = false;
    isEnrollDialogOpen = false;
    isNotificationSlider = false;
    isEnrollAllowed = false;
    isParentClassAllowed = false;
    isSettingSlider = false;
    isDoubtNotification = false;

    // other variables
    notificationCount = 0;
    notificationCountWithPlus = '';
    badgeSubscriber$: any;
    doubtNotificationsSubscriber$: any;
    userConfigSub$: any;
    uploadFileQueue: UploadFile[] = [];
    enterpriseList: EnterpriseDetail[] = [];
    activeEnterprise: EnterpriseDetail;

    mediaQuery = window.matchMedia('(min-width: 320px) and (max-width: 767px)');

    constructor(
        private sharedService: SharedService,
        private router: Router,
        public dialog: MatDialog,
        private _sharedUserService: SharedUserService,
        private notificationService: NotificationService,
        private pubnubService: PubnubService,
        private _mixpanelService: MixpanelService,
        private _authenticationService: AuthenticationService,
        private _materialService: MaterialService,
        protected providerRecordingService: ProviderRecordingService
    ) {}

    ngOnInit() {
        this.subscribeConfigChange();
        this.userConfig = this.sharedService.getUserConfig();
        if (this.userConfig.app_id === this.userType.STUDENT) {
            this.enterpriseList = this.userConfig.enterprise;
            if (!this.sharedService.getActiveEnterprise()) {
                this.sharedService.setActiveEnterprise(this.enterpriseList[0]);
            }
            this.activeEnterprise = this.sharedService.getActiveEnterprise();
        }
        this.userDetailSub$ = this._sharedUserService
            .getUserDetailCall()
            .subscribe((flag) => {
                if (
                    this.sharedService.getToken() &&
                    this.userConfig.app_id === this.userType.STUDENT
                ) {
                    this.userDetail = this._sharedUserService.getUser();
                    if (
                        this.userDetail.user_details &&
                        this.userDetail.user_details.user_id ===
                            this.userConfig.user_id
                    ) {
                        this.userName =
                            this.userDetail.user_details.first_name +
                            ' ' +
                            this.userDetail.user_details.last_name;
                        this.imageUploadUrl = this.userDetail.user_details.avatar_thumbnail;
                    }
                } else if (
                    this.sharedService.getToken() &&
                    this.userConfig.app_id === this.userType.PROVIDER
                ) {
                    this.userDetail = this._sharedUserService.getUser();
                    if (
                        this.userDetail.provider_first_name &&
                        this.userDetail.provider_last_name &&
                        this.userDetail.user
                    ) {
                        if (
                            this.userConfig['user_role_link.role_id'] ===
                            RoleMaster.PROVIDER_OWNER
                        ) {
                            this.userName =
                                this.userDetail.provider_first_name +
                                ' ' +
                                this.userDetail.provider_last_name;
                        } else {
                            this.userName =
                                this.userDetail.user.first_name +
                                ' ' +
                                this.userDetail.user.last_name;
                        }
                    }
                    this.imageUploadUrl =
                        this.userDetail.user &&
                        this.userDetail.user.avatar_thumbnail
                            ? this.userDetail.user.avatar_thumbnail
                            : null;
                }
            });
        if (
            this.userConfig.provider_list &&
            this.userConfig.provider_list.length
        ) {
            this.provider = this.userConfig.provider_list[0];
        }
        this.getNotificationBadgeCount();
        this.subsBadgeCount();
        this.subsDoubtNotifications();
        if (
            this.userConfig['user_role_link.role_id'] ===
                RoleMaster.PROVIDER_OWNER ||
            this.userConfig['user_role_link.role_id'] ===
                RoleMaster.PROVIDER_ADMIN
        ) {
            this.isEnrollAllowed = true;
            this.isParentClassAllowed = true;
        }

        if (
            this.userConfig.app_id === this.userType.PROVIDER &&
            !this._sharedUserService.getConfigUpdated()
        ) {
            this.getConfiguration();
        }
        this.materialUpload();
        this.getCurrentRoute();
    }

    subscribeConfigChange = () => {
        this.userConfigSub$ = this._sharedUserService
            .getConfigDetailCall()
            .subscribe((flag) => {
                if (flag) {
                    this.userConfig = this._sharedUserService.getUserConfig();
                    if (this.userConfig.app_id === this.userType.STUDENT) {
                        this.enterpriseList = this.userConfig.enterprise;
                        if (!this.sharedService.getActiveEnterprise()) {
                            this.sharedService.setActiveEnterprise(
                                this.enterpriseList[0]
                            );
                        } else {
                            this.activeEnterprise = this.sharedService.getActiveEnterprise();
                            const index = this.enterpriseList.findIndex(
                                (elem) =>
                                    elem.provider_id ===
                                    this.activeEnterprise.provider_id
                            );
                            if (index == -1) {
                                this.sharedService.setActiveEnterprise(
                                    this.enterpriseList[0]
                                );
                            }
                        }
                    }
                }
            });
    };

    getCurrentRoute = () => {
        this.router.events.subscribe((res) => {
            this.currentRoute = this.router.url;
        });
    };

    subsBadgeCount() {
        this.badgeSubscriber$ = this.pubnubService
            .getBadge()
            .subscribe((count) => {
                if (count === 0) {
                    this.notificationCount = count;
                } else {
                    this.notificationCount += count;
                    this.showNotificationCount();
                }
            });
    }

    showNotificationCount() {
        if (this.notificationCount > 99) {
            this.notificationCountWithPlus = '99' + '+';
        } else {
            this.notificationCountWithPlus = '' + this.notificationCount;
        }
    }

    subsDoubtNotifications() {
        this.doubtNotificationsSubscriber$ = this.pubnubService
            .getNotificationData()
            .subscribe((response) => {
                if (response && response.payload.question) {
                    this.isDoubtNotification = true;
                }
            });
    }

    onToggleMenu = (menuName) => {
        this.isShowMenu = false;
        this.menuClick.emit(this.isShowMenu);
        switch (menuName) {
            case 'report':
                if (this.activeView === this.htmlView.REPORT) {
                    this.activeView = null;
                } else {
                    this.activeView = this.htmlView.REPORT;
                }
                break;
            default:
                this.activeView = null;
        }
    };

    onClickInstitute = (institute: EnterpriseDetail) => {
        this.sharedService.setActiveEnterprise(institute);
        window.location.reload();
    };

    onLogOut = () => {
        this._mixpanelService.track(
            this.userConfig.app_id === this.userType.STUDENT
                ? MIXPANEL_EVENTS.SINGOUT_STUD
                : MIXPANEL_EVENTS.SINGOUT,
            {}
        );
        this._mixpanelService.isInitialized = false;
        this._mixpanelService.reset();
        this.sharedService.logout();
        this.clearSub();
    };

    onSidebarCollapse = () => {
        this.isShowMenu = !this.isShowMenu;
        this.menuClick.emit(this.isShowMenu);
    };

    onShowDropdown = () => {
        this.settingNav.close();
        this.notificationNav.close();
        this.isShowDropdown = true;
        setTimeout(() => {
            //this.isNotificationSlider = false;
        }, 1000);
    };

    onHideDropdown = () => {
        this.settingNav.close();
        this.notificationNav.close();
        this.isShowDropdown = false;
        setTimeout(() => {
            //this.isNotificationSlider = false;
        }, 1000);
    };

    onCloseNav() {
        this.isDoubtNotification = false;
        if (this.mediaQuery.matches) {
            this.isShowMenu = true;
        }
    }

    onRedirectToRoute = (route: string) => {
        this.isDoubtNotification = false;
        if (this.mediaQuery.matches) {
            this.isShowMenu = true;
        }

        const isUserAllowed = userAllowed(this.sharedService);
        if (!isUserAllowed) {
            return;
        }

        this.router.navigate(['/' + route]);
    };

    openClassListDialog() {
        if (this.mediaQuery.matches) {
            this.isShowMenu = true;
        }

        const isUserAllowed = userAllowed(this.sharedService);
        if (!isUserAllowed) {
            return;
        }

        this.isDialogOpen = !this.isDialogOpen;
        this._mixpanelService.track(MIXPANEL_EVENTS.GO_LIVE_LIST, {});
        const dialogRef = this.dialog.open(ClassesListDialogComponent, {
            panelClass: 'dialog-container',
            data: {}
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.isDialogOpen = false;
        });
    }

    openEnrollDialog() {
        if (this.mediaQuery.matches) {
            this.isShowMenu = true;
        }
        this._mixpanelService.track(MIXPANEL_EVENTS.ENROLL_CLASS_VIEW, {});
        this.isEnrollDialogOpen = !this.isEnrollDialogOpen;
        const dialogRef = this.dialog.open(StudentEnrollDialogComponent, {
            panelClass: 'dialog-container',
            data: {}
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.isEnrollDialogOpen = false;
        });
    }

    openJoinClassListDialog() {
        if (this.mediaQuery.matches) {
            this.isShowMenu = true;
        }
        this.isJoinClassDialogOpen = !this.isJoinClassDialogOpen;
        this._mixpanelService.track(MIXPANEL_EVENTS.JOIN_CLASS_LIST, {});
        const dialogRef = this.dialog.open(StudentJoinClassDialogComponent, {
            panelClass: 'dialog-container',
            data: {}
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.isJoinClassDialogOpen = false;
        });
    }

    onOpenViews(flag) {
        switch (flag) {
            case 'notification':
                const isUserAllowed = userAllowed(this.sharedService);
                if (!isUserAllowed) {
                    return;
                }
                this.onNotificationShow();
                this.isShowDropdown = false;
                this._mixpanelService.track(
                    this.userConfig.app_id === this.userType.STUDENT
                        ? MIXPANEL_EVENTS.NOTIFICATION_LIST_STUD
                        : MIXPANEL_EVENTS.NOTIFICATION_LIST,
                    {}
                );
                break;

            case 'settings':
                this.notificationNav.close();
                this.settingNav.toggle();
                this.isShowDropdown = false;
                this._mixpanelService.track(
                    this.userConfig.app_id === this.userType.STUDENT
                        ? MIXPANEL_EVENTS.SETTING_DRAWER_STUD
                        : MIXPANEL_EVENTS.SETTING_DRAWER,
                    {}
                );
                this.isSettingSlider = true;
                break;
        }
    }

    onNotificationShow = () => {
        if (this.notificationNav.opened) {
            this.notificationNav.close();
            this.isNotificationSlider = false;
            setTimeout(() => {
                //this.isNotificationSlider = false;
            }, 1000);
        } else {
            this.settingNav.close();
            this.isSettingSlider = false;
            this.isNotificationSlider = true;
            this.notificationNav.open();
        }

        setTimeout(() => {
            this.pubnubService.setBadge(0);
        }, 1000);
    };

    onClickOutSide() {
        this.settingNav.close();
        this.notificationNav.close();
        this.isShowDropdown = false;
        this.isSettingSlider = false;
        this.isNotificationSlider = false;
        setTimeout(() => {
            // this.isNotificationSlider = false;
        }, 1000);
    }

    getNotificationBadgeCount() {
        const appId = this.userConfig.app_id;
        let endPoint = ApplicationApi.PROVIDER_NOTIFICATION_BADGE;
        let params = {};
        if (appId === UserTypeEnum.STUDENT) {
            params[
                'providerUUID'
            ] = this.sharedService.getActiveEnterprise().provider_uuid;
            endPoint = ApplicationApi.STUDENT_NOTIFICATION_BADGE;
        }
        this.notificationService
            .getBadgeCount(params, endPoint)
            .subscribe((response) => {
                this.notificationCount = response.payload.data;
                this.showNotificationCount();
            });
    }

    get providerDBUrl() {
        return '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE;
    }

    get studentDBUrl() {
        return '/' + RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE;
    }

    get enrolmentStatusUrl() {
        return '/' + RouteConstant.STUDENT_ENROLLMENT_STATUS_MODULE_ROUTE;
    }

    get studentUrl() {
        return '/' + RouteConstant.STUDENT_MODULE_ROUTE;
    }

    get classesUrl() {
        return '/' + RouteConstant.CLASSES_MODULE_ROUTE;
    }

    get parentClassesUrl() {
        return '/' + RouteConstant.PARENT_CLASSES_MODULE_ROUTE;
    }

    get enrollmentRequestUrl() {
        return '/' + RouteConstant.ENROLLMENT_REQUEST_MODULE_ROUTE;
    }

    get materialUrl() {
        return '/' + RouteConstant.MATERIAL_MODULE_ROUTE;
    }

    // get studentMaterialUrl() {
    //     return '/' + RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE;
    // }

    get practiceTabUrl() {
        return '/' + RouteConstant.PRACTICE_MODULE_ROUTE;
    }

    // get doubtsUrl() {
    //     return '/' + RouteConstant.STUDENT_DOUBT_MODULE_ROUTE;
    // }

    get providerDoubtsUrl() {
        return '/' + RouteConstant.PROVIDER_DOUBT_MODULE_ROUTE;
    }

    get onViewProfile() {
        if (
            this.userConfig &&
            this.userConfig.app_id === this.userType.PROVIDER
        ) {
            return '/' + RouteConstant.PROFILE_DETAILS_MODULE_ROUTE;
        } else if (
            this.userConfig &&
            this.userConfig.app_id === this.userType.STUDENT
        ) {
            return '/' + RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE;
        }
    }

    get recordedSessionUrl() {
        return '/' + RouteConstant.RECORDED_SESSION_MODULE_ROUTE;
    }

    // get studentAssignmentUrl() {
    //     return '/' + RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE;
    // }

    // get studentRecordedSessionUrl() {
    //     return '/' + RouteConstant.STUDENT_RECORDED_SESSION_MODULE_ROUTE;
    // }

    get providerPracticeUrl() {
        return '/' + RouteConstant.PROVIDER_PRACTICE_MODULE_ROUTE;
    }

    get questionBankUrl() {
        return '/' + RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE;
    }

    get courseUrl() {
        return '/' + RouteConstant.COURSE_PROVIDER_MODULE_ROUTE;
    }

    onError = (event) => {
        event.target.src = 'assets/images/svg_files/userProfile.svg';
    };

    ngOnDestroy() {
        this.clearSub();
    }

    navigateToEnroll() {
        const isUserAllowed = userAllowed(this.sharedService);
        if (!isUserAllowed) {
            return;
        }
        this.router.navigate([
            '/' + RouteConstant.ENROLLMENT_REQUEST_MODULE_ROUTE
        ]);
    }

    getConfiguration = () => {
        this._authenticationService
            .getProviderConfig()
            .subscribe((response) => {
                this._sharedUserService.setUserConfig(response.payload);
                this._sharedUserService.setConfigUpdated(true);
            });
    };

    materialUpload = () => {
        this.materialUploadSub$ = this._sharedUserService
            .getMaterialUpload()
            .subscribe((data) => {
                if (!data) {
                    return;
                }
                this.uploadFileQueue.push({
                    data: data,
                    status: this.uploadStatus.PENDING,
                    percentage: 0,
                    isMaterial: data['isMaterial'],
                    fileNames:
                        'File list : \n' +
                        data['materialFile'][0]['files']
                            .map((e, i) => i + 1 + '- ' + e.name + '\n')
                            .join(' ')
                });
                this.upload();
            });
    };

    upload = () => {
        const running = this.uploadFileQueue.find(
            (e) => e.status == this.uploadStatus.UPLADING
        );
        if (running) {
            return;
        }
        const index = this.uploadFileQueue.findIndex(
            (e) => e.status == this.uploadStatus.PENDING
        );
        if (index == -1) {
            return;
        }
        const file = this.uploadFileQueue[index];
        file.status = this.uploadStatus.UPLADING;
        if (file.isMaterial) {
            this._materialService
                .addMaterialFile(file.data['param'], file.data['materialFile'])
                .subscribe(
                    (event: HttpEvent<any>) => {
                        this.uploadFileStatus(event, file);
                    },
                    (err) => {
                        file.percentage = 0;
                        file.status = this.uploadStatus.FAILED;
                        this.sharedService.setSnackBar(
                            'Material Upload Failed.'
                        );
                    }
                );
        } else {
            this.providerRecordingService
                .addRecordingSession(
                    file.data['param'],
                    file.data['materialFile']
                )
                .subscribe(
                    (event: HttpEvent<any>) => {
                        this.uploadFileStatus(event, file);
                    },
                    (err) => {
                        file.percentage = 0;
                        file.status = this.uploadStatus.FAILED;
                        this.sharedService.setSnackBar(
                            'Recorded Session Upload Failed.'
                        );
                    }
                );
        }
    };

    uploadFileStatus = (event, file) => {
        if (event.type === HttpEventType.UploadProgress) {
            file.percentage = Math.round((100 * event.loaded) / event.total);
        }
        if (event.type === HttpEventType.Response) {
            file.status = this.uploadStatus.COMPLETED;
            if (file.isMaterial) {
                this._sharedUserService.setMaterialComplate(file.data['param']);
            } else {
                this._sharedUserService.setRecordedComplate(file.data['param']);
            }
            this.upload();
        }
    };

    clearSub = () => {
        if (this.materialUploadSub$) {
            this.materialUploadSub$.unsubscribe();
        }
        if (this.badgeSubscriber$) {
            this.badgeSubscriber$.unsubscribe();
            this.userDetailSub$.unsubscribe();
        }
        if (this.doubtNotificationsSubscriber$) {
            this.doubtNotificationsSubscriber$.unsubscribe();
        }
        if (this.userConfigSub$) {
            this.userConfigSub$.unsubscribe();
        }
        this.uploadFileQueue = [];
    };

    isRouteActive = (route: string) => {
        route = route.split('?')[0];
        if (route.endsWith('/')) {
            route = route.substring(0, route.length - 1);
        }
        return route === this.currentRoute;
    };
}
