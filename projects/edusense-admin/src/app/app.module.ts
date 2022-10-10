import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UtilityLibModule } from 'utility-lib';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AdminAuthModule } from './admin-public-module/modules/admin-auth-module/admin-auth.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
    AdminNavbarComponent,
    AdminSettingDrawerComponent,
    AdminNotificationDrawerComponent
} from './components';
@NgModule({
    declarations: [
        AppComponent,
        AdminNavbarComponent,
        AdminSettingDrawerComponent,
        AdminNotificationDrawerComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatSidenavModule,
        UtilityLibModule.forRoot(),
        AdminAuthModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [MatSidenavModule]
})
export class AppModule {}
