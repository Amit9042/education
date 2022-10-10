import { Injectable } from '@angular/core';
import { EncryptionFunctions } from '@sharedModule/functions';
import { AppStorageConstants } from '@sharedModule/constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// @ts-ignore
import { UserConfigModel } from '../../public-modules/models';

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

    private materialUpload$: Subject<
        Object
    > = new Subject<Object>();

    private materialUploadCom$: BehaviorSubject<
        Object
    > = new BehaviorSubject<Object>(false);
    
    private recordedUploadCom$: BehaviorSubject<
        Object
    > = new BehaviorSubject<Object>(false);

    private userConfigChangeFlag: BehaviorSubject<
        boolean
    > = new BehaviorSubject<boolean>(false);

    private configUpdated: any = false;

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
    
    setConfigUpdated(value: boolean): void {
        this.configUpdated = value;
    }

    getConfigUpdated(): Observable<boolean> {
        return this.configUpdated;
    }

    setMaterialUpload(value: Object): void {
        this.materialUpload$.next(value);
    }

    getMaterialUpload(): Observable<Object> {
        return this.materialUpload$.asObservable();
    }
    
    setMaterialComplate(value: Object): void {
        this.materialUploadCom$.next(value);
    }

    getMaterialComplate(): Observable<Object> {
        return this.materialUploadCom$.asObservable();
    }
    
    setRecordedComplate(value: Object): void {
        this.recordedUploadCom$.next(value);
    }

    getRecordedComplate(): Observable<Object> {
        return this.recordedUploadCom$.asObservable();
    }

    setConfigDetailCall(value: boolean): void {
        this.userConfigChangeFlag.next(value);
    }

    getConfigDetailCall(): Observable<boolean> {
        return this.userConfigChangeFlag.asObservable();
    }
}
