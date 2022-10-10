import { Injectable } from '@angular/core';
import { EncryptionFunctions } from '../functions';
import { AppStorageConstants } from '../constants';
import { BehaviorSubject, Observable } from 'rxjs';
// @ts-ignore
import { UserConfigModel } from '../shared-models/user-config.model';

@Injectable({
    providedIn: 'root'
})
export class SharedUserService {
    private user: any = null;
    private userConfig: UserConfigModel;

    private loggedInUser$: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );
    private loggedInUserConfig$: BehaviorSubject<any> = new BehaviorSubject<
        UserConfigModel
    >(null);
    private userDetailChangeFlag: BehaviorSubject<
        boolean
    > = new BehaviorSubject<boolean>(false);

    constructor() {}

    // To get & set logged in user
    getUser() {
        if (!this.user) {
            this.user = EncryptionFunctions.DECRYPT_OBJ(
                localStorage.getItem(AppStorageConstants.USER),
                AppStorageConstants.USER
            );
        }
        return this.user;
    }

    setUser(value): void {
        localStorage.setItem(
            AppStorageConstants.USER,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.user = value;
        this.loggedInUser$.next(this.user);
        this.setUserDetailCall(true);
    }

    // To get & set logged in user config
    getUserConfig(): UserConfigModel {
        if (!this.userConfig) {
            this.userConfig = EncryptionFunctions.DECRYPT_OBJ(
                localStorage.getItem(AppStorageConstants.USER_CONFIG),
                AppStorageConstants.USER_CONFIG
            );
        }
        return this.userConfig;
    }

    subcUserConfigChange() {
        return this.loggedInUserConfig$.asObservable();
    }

    setUserConfig(value: UserConfigModel): void {
        localStorage.setItem(
            AppStorageConstants.USER_CONFIG,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.userConfig = value;
        this.loggedInUserConfig$.next(value);
    }

    // To get loggedin user as observable
    getLoggedInUser() {
        return this.loggedInUser$.asObservable();
    }

    setUserDetailCall(value: boolean): void {
        this.userDetailChangeFlag.next(value);
    }

    getUserDetailCall(): Observable<boolean> {
        return this.userDetailChangeFlag.asObservable();
    }
}
