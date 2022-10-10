import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@sharedModule/shared.module';
import {
    ChangePasswordDialogComponent,
    ClassesListDialogComponent,
    ComingSoonComponent,
    NavbarComponent,
    NotificationDrawerComponent,
    SettingDrawerComponent,
    StudentEnrollDialogComponent,
    StudentJoinClassDialogComponent
} from './components';
import { LoginModule } from './public-modules/modules/login-module/login.module';
import { UserAuthModule } from './public-modules/modules/user-auth-module/user-auth.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StudentAuthModule } from './public-modules/modules/student-auth-module/student-auth.module';
import { PagesModule } from './public-modules/modules/pages-module/pages.module';
import { DatePipe } from '@angular/common';
import { StudentNavbarComponent } from './components/student-navbar/student-navbar.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        StudentNavbarComponent,
        ClassesListDialogComponent,
        StudentJoinClassDialogComponent,
        StudentEnrollDialogComponent,
        SettingDrawerComponent,
        NotificationDrawerComponent,
        ChangePasswordDialogComponent,
        ComingSoonComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        PagesModule,
        UserAuthModule,
        LoginModule,
        StudentAuthModule,
        SharedModule,
        MatSidenavModule,
        AppRoutingModule
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent],
    entryComponents: [
        ClassesListDialogComponent,
        StudentJoinClassDialogComponent,
        StudentEnrollDialogComponent,
        ChangePasswordDialogComponent
    ],
    exports: [MatSidenavModule]
})
export class AppModule {}
