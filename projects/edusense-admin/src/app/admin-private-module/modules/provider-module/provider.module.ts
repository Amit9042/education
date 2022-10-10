import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityLibModule } from 'utility-lib';
import { ProviderRoutingModule } from './provider-routing.module';
import {
    ProviderListComponent,
    ProviderViewComponent,
    EditProviderDialogComponent
} from './components';

@NgModule({
    declarations: [
        ProviderListComponent,
        ProviderViewComponent,
        EditProviderDialogComponent
    ],
    imports: [CommonModule, UtilityLibModule, ProviderRoutingModule],
    entryComponents: [EditProviderDialogComponent]
})
export class ProviderModule {}
