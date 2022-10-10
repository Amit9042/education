import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BroadcastRoutingModule } from './broadcast-routing.module';
import { BroadcastDetailsComponent } from './components/broadcast-details/broadcast-details.component';
import { UtilityLibModule } from 'utility-lib';

@NgModule({
    declarations: [BroadcastDetailsComponent],
    imports: [CommonModule, UtilityLibModule, BroadcastRoutingModule]
})
export class BroadcastModule {}
