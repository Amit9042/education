import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    StudentViewProfileContainerComponent,
    StudentEditProfileContainerComponent
} from './components';
import { StudentProfileResolverService } from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: StudentViewProfileContainerComponent
    },
    {
        path: RouteConstant.STUDENT_PROFILE_DETAILS_VIEW_ROUTE,
        component: StudentViewProfileContainerComponent
    },
    {
        path: RouteConstant.STUDENT_PROFILE_DETAILS_EDIT_ROUTE,
        component: StudentEditProfileContainerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentProfileRoutingModule {}
