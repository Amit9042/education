import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    ParentClassesListComponent,
    ParentClassesViewComponent
} from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        component: ParentClassesListComponent
    },
    {
        path: RouteConstant.PARENT_CLASS_LIST_ROUTE,
        component: ParentClassesListComponent
    },
    {
        path: RouteConstant.PARENT_CLASS_VIEW_ROUTE + '/:id',
        component: ParentClassesViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ParentClassesRoutingModule {}
