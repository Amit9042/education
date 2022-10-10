import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrolmentRequestListComponent } from './components';

const routes: Routes = [
    {
        path: '',
        component: EnrolmentRequestListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnrolmentRequestRoutingModule {}
