import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { MIXPANEL } from '@sharedModule/constants';
mixpanel.init(MIXPANEL.TOKEN,{cross_site_cookie:true});

@Injectable({
    providedIn: 'root'
})
export class MixpanelService {
    isInitialized = false;

    /**
     * Initialize mixpanel.
     *
     * @param {string} userToken
     * @memberof MixpanelService
     */
    init(userDetails: {}): void {
        if (!this.isInitialized) {
            mixpanel.reset();
            if (userDetails) {
                mixpanel.identify(userDetails['user_id']);
                this.setPeople({
                    $id: userDetails['user_id'],
                    $name: userDetails['first_name']+' '+userDetails['last_name'],
                    $email: userDetails['email'],
                    $last_login: new Date()
                });
                this.register({
                    id: userDetails['user_id'],
                    email: userDetails['email'],
                    app_id: userDetails['app_id'],
                    contact_number:userDetails['contact_number'],
                    dial_code:userDetails['dial_code'],
                    role_id: userDetails['user_role_link.role_id'],
                    environment: MIXPANEL.TYPE
                });
            }
            this.isInitialized = true;
        }
    }

    /**
     * Push new action to mixpanel.
     *
     * @param {string} id Name of the action to track.
     * @param {*} [action={}] Actions object with custom properties.
     * @memberof MixpanelService
     */
    track(id: string, action: any = {}): void {
        mixpanel.track(id, action);
    }

    /**
     * Reset mixpanel.
     */
    reset() {
        mixpanel.reset();
    }

    /**
     * Register user to mixpanel.
     *
     * @param {*} [action={}] Actions object with custom properties.
     */
    register(data: any = {}) {
        mixpanel.register(data);
    }

    /**
     * People data to mixpanel.
     *
     * @param {*} [action={}] Actions object with custom properties.
     */
    setPeople(data: any = {}) {
        mixpanel.people.set(data);
    }
}
