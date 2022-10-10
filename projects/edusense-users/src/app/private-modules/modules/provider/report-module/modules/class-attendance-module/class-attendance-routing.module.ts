import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    ClassAttendanceListComponent,
    classAttendanceViewComponent
} from './components';
import { AttendanceViewResolverService } from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: ClassAttendanceListComponent
    },
    {
        path: RouteConstant.CLASS_ATTENDANCE_LIST_ROUTE,
        component: ClassAttendanceListComponent
    },
    {
        path: RouteConstant.CLASS_ATTENDANCE_VIEW_ROUTE + '/:id/:sNum',
        component: classAttendanceViewComponent,
        resolve: {
            resolvedData: AttendanceViewResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClassAttendanceRoutingModule {}
