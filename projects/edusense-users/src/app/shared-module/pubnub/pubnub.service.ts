import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PUBNUB, UserTypeEnum, NotificationTemplate } from '@sharedModule/constants';
import { SharedService, SharedUserService } from '@sharedModule/services';

declare const PubNub: any;

@Injectable({
    providedIn: 'root'
})
export class PubnubService {
    pubnub;
    channelNames: string[] = [];
    userType = UserTypeEnum;

    private badgeUpdate: BehaviorSubject<number> = new BehaviorSubject<number>(
        0
    );
    private pushReceive: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private connectionBadgeUpdate: BehaviorSubject<
        number
    > = new BehaviorSubject<number>(0);

    constructor(protected sharedService: SharedService,
        protected sharedUserService: SharedUserService) {
        const userConfig = this.sharedService.getUserConfig();
        const subKey =
            userConfig.app_id === UserTypeEnum.PROVIDER
                ? PUBNUB.PROVIDER_SUB_KEY
                : PUBNUB.STUDENT_SUB_KEY;

        this.pubnub = new PubNub({
            publishKey: '',
            subscribeKey: subKey,
            ssl: true
        });
        this.pubnub.addListener({
            status: (statusEvent) => {
                if (statusEvent.category === PUBNUB.CONNECTION_STATUS) {
                    console.log('connected');
                } else if (
                    statusEvent.category === PUBNUB.DIS_CONNECTION_STATUS
                ) {
                    this.pubnub.reconnect();
                } else if (statusEvent.category === PUBNUB.TIMEOUT) {
                    console.log('timeout');
                    this.pubnub.reconnect();
                } else if (statusEvent.category === PUBNUB.RE_CONNECT_STATUS) {
                    console.log('reconnected');
                } else {
                    if (status['statusCode'] === PUBNUB.STATUS_CODE_504) {
                        console.log('Try to reconnect');
                        this.pubnub.reconnect();
                    } else {
                        if (statusEvent['error'] === true) {
                            this.pubnub.reconnect();
                            console.log(statusEvent, 'Log for check error');
                        }
                    }
                }
            },
            message: (data) => {
                this.setNotificationData(data.message);
            }
        });
    }

    subscribeChannels(channelNames: string[]) {
        if (
            channelNames &&
            this.channelNames.toString() !== channelNames.toString()
        ) {
            this.pubnub.subscribe(
                { channels: channelNames, triggerEvents: ['message'] },
                (error) => {
                    console.error('error', error);
                }
            );
            this.channelNames = channelNames;
        }
    }

    unsubscribeChannels() {
        this.pushReceive.next(null);
        this.pubnub.unsubscribe({ channels: this.channelNames });
        this.channelNames = [];
    }

    setNotificationData(data: any) {
      if (data) {
        const notificationText = data.message;
        if (notificationText && data.template_name != NotificationTemplate.STUDENT_REMOVED) {
          this.sharedService.setSnackBar(notificationText);
        }
        const providerUUID = data.payload?.provider_detail?.provider_uuid
        const currentProvider = this.sharedService.getActiveEnterprise().provider_uuid;
        if (!providerUUID || (providerUUID && providerUUID === currentProvider)) {
          this.pushReceive.next({
            template: data.template_name,
            payload: data.payload
          });
          if (data.template_name != NotificationTemplate.STUDENT_REMOVED) {
            this.setBadge(1);
          }
        } else if (data.template_name === NotificationTemplate.PARENT_CLASS_ASSIGN_STUDENT) {
            this.sharedUserService.setConfigDetailCall(true);
        }
      } else {
        this.pushReceive.next(null);
      }
    }

    getNotificationData(): Observable<any> {
        return this.pushReceive.asObservable();
    }

    setBadge(count): void {
        this.badgeUpdate.next(count);
    }

    getBadge(): Observable<number> {
        return this.badgeUpdate.asObservable();
    }

    setConnectionBadge(count): void {
        this.connectionBadgeUpdate.next(count);
    }

    getConnectionBadge(): Observable<number> {
        return this.connectionBadgeUpdate.asObservable();
    }
}
