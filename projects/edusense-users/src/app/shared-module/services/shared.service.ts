import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SharedUserService } from './shared-user.service';
import { EncryptionFunctions } from '@sharedModule/functions';
import { AppStorageConstants } from '@sharedModule/constants';
import { ClassChannelModel, ProviderChannelModel } from '@sharedModule/models';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class SharedService extends SharedUserService {
    private token = '';
    private refreshToken = '';
    private loaderCount = 0;
    private providerChannel: ProviderChannelModel;
    private studentChannel: ClassChannelModel;
    private signupDetail: any = '';
    private recordingSessId = 0;
    private verificationToken = '';
    private redirectionFrom;
    private dateForAssignmentRedirection: string;
    private assignmentRedirectionData: string;
    private activeEnterprise;

    private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    private isLoggedInUser: BehaviorSubject<boolean> = new BehaviorSubject<
        boolean
    >(false);
    private studentChannelUpdate: BehaviorSubject<
        boolean
    > = new BehaviorSubject<boolean>(false);
    private initiateSnackBar: BehaviorSubject<string> = new BehaviorSubject<
        string
    >('');

    constructor(private router: Router, private dialogRef: MatDialog) {
        super();
    }

    // To get & set loader status
    getLoader(): Observable<boolean> {
        return this.isLoading.asObservable();
    }

    setLoader(val: boolean): void {
        if (val) {
            this.loaderCount += 1;
        } else {
            this.loaderCount -= 1;
            if (this.loaderCount !== 0) {
                val = true;
            }
        }
        this.isLoading.next(val);
    }

    // To get & set toast message
    getSnackBar(): Observable<string> {
        return this.initiateSnackBar.asObservable();
    }

    setSnackBar(val: string): void {
        this.initiateSnackBar.next(val);
    }

    // To get & set loggedin status
    getLoggedInUserStatus() {
        if (!this.isLoggedInUser.value) {
            this.isLoggedInUser.next(
                EncryptionFunctions.DECRYPT_OBJ(
                    localStorage.getItem(AppStorageConstants.LOGIN_STATUS),
                    AppStorageConstants.LOGIN_STATUS
                )
            );
        }
        return this.isLoggedInUser.asObservable();
    }

    setLoggedInUserStatus(value: boolean) {
        localStorage.setItem(
            AppStorageConstants.LOGIN_STATUS,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.isLoggedInUser.next(value);
    }

    // To get & set token
    getToken(): string {
        this.token = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.TOKEN)
        );
        return this.token;
    }

    setToken(value: string): void {
        localStorage.setItem(
            AppStorageConstants.TOKEN,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.token = value;
    }

    // To get & set refresh token
    getRefreshToken(): string {
        this.refreshToken = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.REFRESH_TOKEN)
        );
        return this.refreshToken;
    }

    setRefreshToken(value: string): void {
        localStorage.setItem(
            AppStorageConstants.REFRESH_TOKEN,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.refreshToken = value;
    }

    getSignupUserData() {
        if (!this.signupDetail) {
            this.signupDetail = EncryptionFunctions.DECRYPT_OBJ(
                localStorage.getItem(AppStorageConstants.SIGN_UP_DETAILS)
            );
        }
        return this.signupDetail;
    }

    setSignupUserData(value): void {
        localStorage.setItem(
            AppStorageConstants.SIGN_UP_DETAILS,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.signupDetail = value;
    }

    getSignupType() {
        if (!this.signupDetail) {
            this.signupDetail = EncryptionFunctions.DECRYPT_OBJ(
                localStorage.getItem(AppStorageConstants.SIGN_UP_TYPE)
            );
        }
        return this.signupDetail;
    }

    setSignupType(value): void {
        localStorage.setItem(
            AppStorageConstants.SIGN_UP_TYPE,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.signupDetail = value;
    }

    // Other methods
    isLoggedIn(): boolean {
        return this.isValidToken(this.getToken());
    }

    logout(url?): void {
        this.clearSession();
        this.dialogRef.closeAll();
        if (url) {
            this.router.navigate(['/' + url]);
        } else {
            this.router.navigate(['']);
        }
    }

    // To get & set refresh token
    getProviderChannel(): ProviderChannelModel {
        const value = localStorage.getItem(
            AppStorageConstants.PROVIDER_CHANNEL
        );
        if (value) {
            this.providerChannel = JSON.parse(
                EncryptionFunctions.DECRYPT_OBJ(value)
            );
            return this.providerChannel;
        }
        return null;
    }

    setProviderChannel(value: ProviderChannelModel): void {
        localStorage.setItem(
            AppStorageConstants.PROVIDER_CHANNEL,
            EncryptionFunctions.ENCRYPT_OBJ(JSON.stringify(value))
        );
        this.providerChannel = value;
    }

    // To get & set refresh token
    getStudentChannel(): ClassChannelModel {
        const value = localStorage.getItem(AppStorageConstants.STUDENT_CHANNEL);
        if (value) {
            this.studentChannel = JSON.parse(
                EncryptionFunctions.DECRYPT_OBJ(value)
            );
            return this.studentChannel;
        }
        return null;
    }

    setStudentChannel(value: ClassChannelModel): void {
        localStorage.setItem(
            AppStorageConstants.STUDENT_CHANNEL,
            EncryptionFunctions.ENCRYPT_OBJ(JSON.stringify(value))
        );
        this.studentChannel = value;
    }

    // To get & set student channel
    getStudentChannelUpdate(): Observable<boolean> {
        return this.studentChannelUpdate.asObservable();
    }

    setStudentChannelUpdate(value: boolean): void {
        this.studentChannelUpdate.next(value);
    }

    // Helper methods
    private clearSession() {
        this.setRefreshToken(null);
        this.setToken(null);
        this.setUser(null);
        this.setUserConfig(null);
        this.setLoggedInUserStatus(false);
        localStorage.clear();
        sessionStorage.clear();
    }

    private isValidToken(token: string): boolean {
        return !!token;
    }

    // To get & set token
    getVerificationToken(): string {
        this.verificationToken = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.VERIFICATION_TOKEN)
        );
        return this.verificationToken;
    }

    setVerificationToken(value: string): void {
        localStorage.setItem(
            AppStorageConstants.VERIFICATION_TOKEN,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.verificationToken = value;
    }

    // To get & set token
    getRecordingSessionId(): number {
        this.recordingSessId = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.PROVIDER_REC_SESS_ID)
        );
        return +this.recordingSessId;
    }

    setRecordingSessionId(value: number): void {
        localStorage.setItem(
            AppStorageConstants.PROVIDER_REC_SESS_ID,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.recordingSessId = value;
    }

    getRedirectionFrom(): number {
        this.redirectionFrom = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.REDIRECTION_FROM)
        );
        return this.redirectionFrom;
    }

    setRedirectionFrom(value: number): void {
        localStorage.setItem(
            AppStorageConstants.REDIRECTION_FROM,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.redirectionFrom = value;
    }

    getDateForAssignmentRedirection(): string {
        this.dateForAssignmentRedirection = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(
                AppStorageConstants.ASSIGNMENT_REDIRECTION_DATE
            )
        );
        return this.dateForAssignmentRedirection;
    }

    setDateForAssignmentRedirection(value: string): void {
        localStorage.setItem(
            AppStorageConstants.ASSIGNMENT_REDIRECTION_DATE,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.dateForAssignmentRedirection = value;
    }

    getAssignmentRedirectionData(): string {
        this.assignmentRedirectionData = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(
                AppStorageConstants.ASSIGNMENT_REDIRECTION_DATA
            )
        );
        return this.assignmentRedirectionData;
    }

    setAssignmentRedirectionData(value: string): void {
        localStorage.setItem(
            AppStorageConstants.ASSIGNMENT_REDIRECTION_DATA,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.assignmentRedirectionData = value;
    }

    getActiveEnterprise() {
        this.activeEnterprise = EncryptionFunctions.DECRYPT_OBJ(
            localStorage.getItem(AppStorageConstants.ACTIVE_ENTERPRISE)
        );
        return this.activeEnterprise;
    }

    setActiveEnterprise(value): void {
        localStorage.setItem(
            AppStorageConstants.ACTIVE_ENTERPRISE,
            EncryptionFunctions.ENCRYPT_OBJ(value)
        );
        this.activeEnterprise = value;
    }
}
