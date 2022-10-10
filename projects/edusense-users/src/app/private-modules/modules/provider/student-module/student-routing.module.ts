import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentListComponent, StudentProfileComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        component: StudentListComponent
    },
    {
        path: RouteConstant.PROVIDER_STUDENT_VIEW_ROUTE + '/:id',
        component: StudentProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentRoutingModule {}
