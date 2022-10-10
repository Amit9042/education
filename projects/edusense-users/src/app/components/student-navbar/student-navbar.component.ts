import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    ApplicationApi,
    MIXPANEL_EVENTS,
    RouteConstant,
    UserTypeEnum,
    NotificationTemplate
} from '@sharedModule/constants';
import { MatDialog } from '@angular/material/dialog';
import { MixpanelService } from '@sharedModule/services/shared-mixpanel';
import { StudentJoinClassDialogComponent } from '../student-join-class-dialog/student-join-class-dialog.component';
import { EnterpriseDetail, UserConfigModel } from '../../public-modules/models';
import { SharedService, SharedUserService } from '@sharedModule/services';
import { StudentEnrollDialogComponent } from '..';
import { Router } from '@angular/router';
import { appLogger, userAllowed } from '@sharedModule/functions';
import { PubnubService } from '@sharedModule/pubnub';
import { NotificationService } from '../../private-modules/services';
import { StudentAutenticationService } from '../../public-modules/services';

export enum ViewsEnumStudent {
    LEARN,
    ASSESSMENT,
    LEARN_MOBILE,
    ASSESSMENT_MOBILE
}

@Component({
    selector: 'es-user-student-navbar',
    templateUrl: './student-navbar.component.html',
    styleUrls: ['./student-navbar.component.scss']
})
export class StudentNavbarComponent implements OnInit, OnDestroy {
    @ViewChild('notificationNav', { static: true }) notificationNav;
    @ViewChild('settingNav', { static: true }) settingNav;

    readonly htmlView = ViewsEnumStudent;
    activeView: ViewsEnumStudent = this.htmlView.LEARN;
    userType = UserTypeEnum;

    // Data variables
    enterpriseList: EnterpriseDetail[] = [];
    activeEnterprise: EnterpriseDetail;
    userConfig: UserConfigModel = null;
    imageUploadUrl = '';
    userName = '';
    userDetail: any;

    // State variables
    isJoinClassDialogOpen = false;
    isShowDropdown = false;
    isEnrollDialogOpen = false;
    isShowStudentNavigation = true;
    isStudentResponsive = false;
    isSettingSlider = false;
    isNotificationSlider = false;
    isSelectedLearn = false;
    isSelectedAssessment = false;

    notificationCount = 0;
    notificationCountWithPlus = '';
    badgeSubscriber$: any;
    userConfigSub$: any;
    enterpriseNotificationsSub$: any;
    userDetailSub$: any;

    mediaQuery = window.matchMedia('(min-width: 320px) and (max-width: 767px)');

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private _mixpanelService: MixpanelService,
        private sharedService: SharedService,
        private sharedUserService: SharedUserService,
        private notificationService: NotificationService,
        private pubnubService: PubnubService,
        private cd: ChangeDetectorRef,
        private _studentService: StudentAutenticationService
    ) {}

    ngOnInit(): void {
        this.subscribeConfigChange();
        this.userConfig = this.sharedService.getUserConfig();
        this.userDetailSub$ = this.sharedUserService
            .getUserDetailCall()
            .subscribe((flag) => {
                if (this.userConfig.app_id === this.userType.STUDENT) {
                    this.enterpriseList = this.userConfig.enterprise;
                    if (!this.sharedService.getActiveEnterprise()) {
                        this.sharedService.setActiveEnterprise(
                            this.enterpriseList[0]
                        );
                    }
                    this.activeEnterprise = this.sharedService.getActiveEnterprise();
                }
                this.userDetail = this.sharedUserService.getUser();
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
            });
        if (this.mediaQuery.matches) {
            this.isShowStudentNavigation = false;
        }
        if (
            window.location.pathname ===
            '/' + RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE ||
            window.location.pathname ===
            '/' + RouteConstant.STUDENT_RECORDED_SESSION_MODULE_ROUTE ||
            window.location.pathname ===
            '/' + RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE ||
            window.location.pathname ===
            '/' + RouteConstant.STUDENT_COURSE_CONTAINER ||
            window.location.pathname.includes(RouteConstant.STUDENT_COURSE_DETAILS_CONTAINER) ||
            window.location.pathname.includes(RouteConstant.ENROLL_COURSE_CONTAINER) 
            
        ) {
            this.activeView = this.htmlView.LEARN;
        } else if (
            window.location.pathname ===
            '/' + RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE
        ) {
            this.activeView = this.htmlView.ASSESSMENT;
        } else {
            this.activeView = null;
        }
        this.getNotificationBadgeCount();
        this.subsBadgeCount();
        this.subEnterpriseNotifications();
    }

    subEnterpriseNotifications() {
        this.enterpriseNotificationsSub$ = this.pubnubService
            .getNotificationData()
            .subscribe((response) => {
                if (
                    response &&
                    response.template == NotificationTemplate.STUDENT_REMOVED
                ) {
                    this.sharedUserService.setConfigDetailCall(true);
                }
            });
    }

    subscribeConfigChange = () => {
        this.userConfigSub$ = this.sharedUserService
            .getConfigDetailCall()
            .subscribe((flag) => {
                if (flag) {
                    this.getUpdatedConfig();
                    setTimeout(() => {
                        this.userConfig = this.sharedUserService.getUserConfig();
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
                                    this.activeEnterprise = this.sharedService.getActiveEnterprise();
                                }
                            }
                        }
                    }, 2000);
                }
            });
    };

    getUpdatedConfig() {
        const config = this.sharedService.getUserConfig();
        if (config.app_id === this.userType.STUDENT) {
            this._studentService.getStudentConfig().subscribe((response) => {
                this.sharedUserService.setUserConfig(response.payload);
                if (
                    response.payload.enterprise.length > 0 &&
                    !config.enterprise.length
                ) {
                    let instituteList: EnterpriseDetail[] = response.payload.enterprise.sort(
                        (a, b) =>
                            new Date(a.jointime).getTime() -
                            new Date(a.jointime).getTime()
                    );
                    this.sharedService.setActiveEnterprise(instituteList[0]);
                }
            });
        }
    }

    // Page events
    onClickInstitute = (institute: EnterpriseDetail) => {
        this.sharedService.setActiveEnterprise(institute);
        window.location.reload();
    };

    onShowDropdown = () => {
        /*this.settingNav.close();
this.notificationNav.close();*/
        this.isShowDropdown = !this.isShowDropdown;
        /*setTimeout(() => {
//this.isNotificationSlider = false;
}, 1000);*/
    };

    onHideDropdown = () => {
        /*this.settingNav.close();
this.notificationNav.close();*/
        this.isShowDropdown = false;
        /*setTimeout(() => {
//this.isNotificationSlider = false;
}, 1000);*/
    };

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

    openJoinClassListDialog() {
        this.onHideStudentResponsiveNavbar(false, false);
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

    openEnrollDialog() {
        /*if (this.mediaQuery.matches) {
this.isShowMenu = true;
}*/
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

    clearSub = () => {
        if (this.badgeSubscriber$) {
            this.badgeSubscriber$.unsubscribe();
        }
        if (this.userConfigSub$) {
            this.userConfigSub$.unsubscribe();
        }
        if (this.enterpriseNotificationsSub$) {
            this.enterpriseNotificationsSub$.unsubscribe();
        }
        if (this.userDetailSub$) {
            this.userDetailSub$.unsubscribe();
        }
    };

    onShowMenuStudent = () => {
        this.isStudentResponsive = true;
        this.isShowStudentNavigation = true;
    };

    onHideStudentResponsiveNavbar = (
        isSelectedLearn: boolean,
        isSelectedAssessment: boolean
    ) => {
        this.isSelectedLearn = isSelectedLearn;
        this.isSelectedAssessment = isSelectedAssessment;
        appLogger(this.isSelectedLearn);
        this.activeView = null;
        if (this.mediaQuery.matches) {
            this.isShowStudentNavigation = false;
            this.isStudentResponsive = false;
        }
    };

    onClickOutSide() {
        // this.settingNav.close();
        // this.notificationNav.close();
        this.isShowDropdown = false;
        // this.isSettingSlider = false;
        // this.isNotificationSlider = false;
        // setTimeout(() => {
        //     this.isNotificationSlider = false;
        // }, 1000);
    }

    // Helper methods
    onError = (event) => {
        event.target.src = 'assets/images/svg_files/userProfile.svg';
    };

    get studentMaterialUrl() {
        return '/' + RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE;
    }

    get studentRecordedSessionUrl() {
        return '/' + RouteConstant.STUDENT_RECORDED_SESSION_MODULE_ROUTE;
    }

    get studentCourseUrl() {
        return '/' + RouteConstant.STUDENT_COURSE_CONTAINER;
    }

    get studentAssignmentUrl() {
        return '/' + RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE;
    }

    get onViewProfile() {
        return '/' + RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE;
    }

    get doubtsUrl() {
        return '/' + RouteConstant.STUDENT_DOUBT_MODULE_ROUTE;
    }

    get comingSoonUrl() {
        return '/' + RouteConstant.COMING_SOON_ROUTE;
    }

    get studentPracticeTabUrl() {
        return '/' + RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE;
    }

    onEditProfile() {
        this.isShowDropdown = false;
        this.router.navigate([
            '/' + RouteConstant.STUDENT_PROFILE_DETAILS_EDIT
        ]);
    }

    isShowLearn() {
        if (this.mediaQuery.matches) {
            this.activeView = this.htmlView.LEARN_MOBILE;
            this.isSelectedAssessment = false;
        } else {
            this.activeView = this.htmlView.LEARN;
            this.isSelectedAssessment = false;
        }
    }

    isShowAssessment() {
        if (this.mediaQuery.matches) {
            this.activeView = this.htmlView.ASSESSMENT_MOBILE;
            this.isSelectedLearn = false;
        } else {
            this.activeView = this.htmlView.ASSESSMENT;
            this.isSelectedLearn = false;
        }
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
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.clearSub();
    }
}
