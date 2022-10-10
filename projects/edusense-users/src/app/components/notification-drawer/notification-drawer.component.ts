import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    NotificationService,
    StudentClassesService
} from '../../private-modules/services';
import {
  NotificationTypeEnum,
  PAGE_SIZE_OPTIONS,
  NotificationTemplate, UserTypeEnum, ApplicationApi
} from '@sharedModule/constants';
import {
    Entities,
    Notification,
    NotificationList,
    Templates,
    UserConfigModel
} from '../../public-modules/models';
import { notificationFormatedTime } from '@sharedModule/functions';
import { SharedService } from '@sharedModule/services';
import { RouteHistoryService } from '@sharedModule/services/route-history';
import { PubnubService } from '@sharedModule/pubnub';
import { Router } from '@angular/router';
import { MaterialService } from '../../private-modules/modules/student/student-material-module/service';
@Component({
    selector: 'app-notification-drawer',
    templateUrl: './notification-drawer.component.html',
    styleUrls: ['./notification-drawer.component.scss']
})
export class NotificationDrawerComponent implements OnInit {
    // Angular variables
    @Output() clickEvent = new EventEmitter<boolean>();
    @Input() data;
    @Output() closeDrawerEvent = new EventEmitter<boolean>();

    // datasource varibles
    userConfig: UserConfigModel = null;

    // Pagination params
    pageNumber = 1;
    totalItems;
    pageSize = PAGE_SIZE_OPTIONS[0];
    rowNumber: number;
    serverTime: number;

    // Notification Params
    earlierNotifications: NotificationList[] = [];
    newNotifications: NotificationList[] = [];
    viewEarlierNotifications: Notification[] = [];
    viewNewNotifications: Notification[] = [];
    entities;
    templates;
    currentLang = 'en';

    constructor(
        protected sharedService: SharedService,
        protected pubnubService: PubnubService,
        protected notificationService: NotificationService,
        private _router: Router,
        private _routerHistoryService: RouteHistoryService,
        private materialService: MaterialService,
        protected classService: StudentClassesService
    ) {}

    ngOnInit() {
        this.entities = new Map<string, Entities>();
        this.templates = new Map<string, Templates>();
        this.userConfig = this.sharedService.getUserConfig();
        this.getNotifications();
    }

    queryParams(): any {
        return {
            type:
                this.pageNumber === 1
                    ? NotificationTypeEnum.ALL
                    : NotificationTypeEnum.EARLIER,
            pageNumber: this.pageNumber,
            recordsPerPage: this.pageSize
        };
    }

    getNotifications() {
        const appId = this.userConfig.app_id;
        let endPoint = ApplicationApi.PROVIDER_NOTIFICATION_LIST;
        let params = this.queryParams();
        if (appId === UserTypeEnum.STUDENT) {
          params["providerUUID"] = this.sharedService.getActiveEnterprise().provider_uuid;
          endPoint = ApplicationApi.STUDENT_NOTIFICATION_LIST;
        }
        this.notificationService
            .getNotificationList(params, endPoint)
            .subscribe(response => {
                this.serverTime = response.payload.serverDateTime;
                this.totalItems = response.payload.pager
                    ? response.payload.pager.totalRecords
                    : 0;
                this.handleNotificationResponse(response);
            });
    }

    handleNotificationResponse(response) {
        if (response.payload.data) {
            if (response.payload.data.templates) {
                response.payload.data.templates.forEach(
                    (template: Templates) => {
                        this.templates.set(template._id, template);
                    }
                );
            }
            if (response.payload.data.entities) {
                response.payload.data.entities.forEach((entitiy: Entities) => {
                    this.entities.set(entitiy._id, entitiy);
                });
            }
            const isViewed = [];
            this.newNotifications = response.payload.data.notifications.new
                ? response.payload.data.notifications.new
                : [];
            this.newNotifications.map((notification: NotificationList) => {
                if (!notification.is_viewed) {
                    isViewed.push(notification._id);
                }
                this.viewNewNotifications.push(
                    this.prepareNotificationTemplate(notification)
                );
            });
            this.earlierNotifications = response.payload.data.notifications
                .earlier
                ? response.payload.data.notifications.earlier
                : [];
            this.earlierNotifications.map((notification: NotificationList) => {
                if (!notification.is_viewed) {
                    isViewed.push(notification._id);
                }
                this.viewEarlierNotifications.push(
                    this.prepareNotificationTemplate(notification)
                );
                this.rowNumber = this.viewEarlierNotifications.length + 1;
            });
            if (isViewed.length > 0) {
                const body = { isViewed };
                this.viewReadNotifications(body);
            }
        }
    }

    prepareNotificationTemplate(notification) {
        // get template from template id
        const templateData = this.templates.get(notification.template._id);

        // get template text with current language selected
        let template = templateData[this.currentLang];

        // get template attributes
        for (const attribute of notification.template.template_attributes) {
            // replace template attributes with template text
            template = template.replace(attribute.key, attribute.value);
            // now get value of attributes from entity
            let paramKey = attribute.value.replace('{{', '');
            paramKey = paramKey.replace('}}', '');
            // split param key to search entity
            const entityKey = paramKey.split('.');
            // get entity
            const entityData = this.entities.get(
                notification.params[entityKey[0]]
            );
            // replace entity value with template
            template = template.replace(
                attribute.value,
                entityData[entityKey[1]]
            );
        }

        // avatar
        let avatar = null;
        for (const avt of notification.avatar) {
            const entityKey = avt.split('.');
            const entityData = this.entities.get(
                notification.params[entityKey[0]]
            );
            avatar = entityData[entityKey[1]];
        }

        // build redirect url
        let redirectUrl = templateData.web_redirect;
        if (notification.template.hasOwnProperty('web_redirect_attributes')) {
            // tslint:disable-next-line:prefer-for-of
            for (
                let k = 0;
                k < notification.template.web_redirect_attributes.length;
                k++
            ) {
                redirectUrl = redirectUrl.replace(
                    notification.template.web_redirect_attributes[k].key,
                    notification.template.web_redirect_attributes[k].value
                );
                // now get value of attributes from entity
                let paramKey = notification.template.web_redirect_attributes[
                    k
                ].value.replace('{{', '');
                paramKey = paramKey.replace('}}', '');
                // split param key to search entity
                const entityKey = paramKey.split('.');
                // get entity
                // const entityData = this.entities.filter(enti => enti._id === notification.params[entityKey[0]]);
                const entityData = this.entities.get(
                    notification.params[entityKey[0]]
                );
                // replace entity value with template
                redirectUrl = redirectUrl.replace(
                    notification.template.web_redirect_attributes[k].value,
                    entityData[entityKey[1]]
                );
            }
        }
        // date time
        const dateTime = notificationFormatedTime(
            this.serverTime,
            notification.created_at_timestamp
        );

        const data: Notification = {
            _id: notification._id,
            html: template,
            isRead: notification.is_read,
            isView: notification.is_viewed,
            date: dateTime,
            redirectUrl,
            templateName: templateData['template_name'],
            payload: notification['payload'],
            avatar
        };
        return data;
    }

    viewReadNotifications(body) {
      const appId = this.userConfig.app_id;
      let endpoint = ApplicationApi.PROVIDER_NOTIFICATION_VIEW;
      if (appId === UserTypeEnum.STUDENT) {
        body["providerUUID"] = this.sharedService.getActiveEnterprise().provider_uuid;
        endpoint = ApplicationApi.STUDENT_NOTIFICATION_VIEW;
      }
      this.notificationService
            .viewReadNotification(body, endpoint)
            .subscribe(response => {
                if (body.hasOwnProperty('isViewed')) {
                    this.viewNewNotifications.map(notifcation => {
                        return (notifcation.isView = true);
                    });
                    this.viewEarlierNotifications.map(notifcation => {
                        return (notifcation.isView = true);
                    });
                } else {
                    this.viewNewNotifications.map(notifcation => {
                        return notifcation._id === body['isRead'][0]
                            ? (notifcation.isRead = true)
                            : notifcation.isRead;
                    });
                    this.viewEarlierNotifications.map(notifcation => {
                        return notifcation._id === body['isRead'][0]
                            ? (notifcation.isRead = true)
                            : notifcation.isRead;
                    });
                }
            });
    }

    markAsAllRead() {
      const appId = this.userConfig.app_id;
      let endPoint = ApplicationApi.PROVIDER_NOTIFICATION_READ_ALL;
      let params = {}
      if (appId === UserTypeEnum.STUDENT) {
        params["providerUUID"] = this.sharedService.getActiveEnterprise().provider_uuid;
        endPoint = ApplicationApi.STUDENT_NOTIFICATION_READ_ALL;
      }
      this.notificationService
            .readAllNotifications(params, endPoint)
            .subscribe(response => {
                this.pubnubService.setBadge(0);
                this.viewNewNotifications.map(notifcation => {
                    return (notifcation.isRead = true);
                });
                this.viewEarlierNotifications.map(notifcation => {
                    return (notifcation.isRead = true);
                });
            });
    }

    onCloseDrawer() {
        this.clickEvent.emit();
        this.closeDrawerEvent.emit(false);
    }

    onScroll() {
        if (this.rowNumber < this.totalItems) {
            this.getNotifications();
        }
    }

    getRedirectUrl(notification: Notification) {
        this.onCloseDrawer();
        if (!notification.isRead) {
            const body = { isRead: [notification._id] };
            this.viewReadNotifications(body);
        }
        if (notification.templateName == NotificationTemplate.PROVIDER_JOINED) {
            this.onJoinClass(
                notification.redirectUrl,
                notification.payload['class_id']
            );
        } else {
            let queryParams = {};
            switch (notification.templateName) {
                case NotificationTemplate.PROVIDER_MATERIAL_ADD:
                    queryParams = {
                        queryParams: { id: notification.payload['material_id'] }
                    };
                    this.materialService.setMaterialFilterData({
                        subject_id: notification.payload['subject_id'],
                        subject_name: notification.payload['subject_name']
                    });
                    break;
            }
            this.redirect(notification.redirectUrl, queryParams);
        }
    }

    redirect(redirectUrl, queryParams) {
        if (this._routerHistoryService.getCurrentUrl().includes(redirectUrl)) {
            this._router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this._router.navigate([redirectUrl], queryParams));
        } else {
            this._router.navigate([redirectUrl], queryParams);
        }
    }

    onJoinClass = (redirectUrl, class_id) => {
        const params = { class_id };
        this.classService.joinClass(params).subscribe(response => {
            const oldChannel = this.sharedService.getStudentChannel();
            this.sharedService.setStudentChannel(response.payload);
            if (oldChannel) {
                this.sharedService.setStudentChannelUpdate(true);
            }
            this._router.navigate([redirectUrl], {});
        });
    };

    onError = event => {
        event.target.src = 'assets/images/svg_files/studentProfile.svg';
    };
}
