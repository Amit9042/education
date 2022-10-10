import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileDetailsRoutingModule } from './profile-details-routing.module';
import {
    ViewProfileContainerComponent,
    ProviderViewProfileComponent,
    PersonalViewProfileComponent,
    EditProfileContainerComponent,
    ProviderDetailsProfileComponent,
    LocationDetailsProfileComponent,
    PersonalDetailsProfileComponent,
    PersonalDetailsProfileOtherComponent,
    PersonalViewProfileOtherComponent
} from './components';
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
    declarations: [
        ViewProfileContainerComponent,
        ProviderViewProfileComponent,
        PersonalViewProfileComponent,
        EditProfileContainerComponent,
        ProviderDetailsProfileComponent,
        LocationDetailsProfileComponent,
        PersonalDetailsProfileComponent,
        PersonalDetailsProfileOtherComponent,
        PersonalViewProfileOtherComponent
    ],
    imports: [CommonModule, SharedModule, ProfileDetailsRoutingModule]
})
export class ProfileDetailsModule {}
