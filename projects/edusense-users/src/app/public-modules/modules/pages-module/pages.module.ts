import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import {
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    StudentsPageComponent,
    ProvidersPageComponent,
    AboutUsComponent,
    PrivacyPolicyPageComponent,
    GettingStartedContactUsComponent,
    ContactUsPageComponent,
    TeamPageComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';
import { SwiperModule } from 'angular2-useful-swiper';
import { NgxCaptchaModule } from 'ngx-captcha';


@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HomePageComponent,
        StudentsPageComponent,
        ProvidersPageComponent,
        AboutUsComponent,
        PrivacyPolicyPageComponent,
        GettingStartedContactUsComponent,
        ContactUsPageComponent,
        TeamPageComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SwiperModule,
        NgxCaptchaModule,
        PagesRoutingModule
    ]
})
export class PagesModule {}
