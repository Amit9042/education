import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassListComponent, ClassViewComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        component: ClassListComponent
    },
    {
        path: RouteConstant.CLASS_LIST_ROUTE,
        component: ClassListComponent
    },
    {
        path: RouteConstant.CLASS_VIEW_ROUTE + '/:id',
        component: ClassViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClassesRoutingModule {}
