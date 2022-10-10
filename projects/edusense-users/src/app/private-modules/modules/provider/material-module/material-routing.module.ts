import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    MaterialListComponent,
    MaterialViewComponent,
    GradeSelectionComponent,
    SubjectSelectionComponent,
    MaterialSelectionComponent
} from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    // {
    //     path: '',
    //     component: MaterialListComponent
    // },
    // {
    //     path: RouteConstant.MATERIAL_LIST_ROUTE,
    //     component: MaterialListComponent
    // },
    {
        path: RouteConstant.MATERIAL_VIEW_ROUTE + '/:id',
        component: MaterialViewComponent
    },
    {
        path: '',
        component: GradeSelectionComponent
    },
    {
        path: RouteConstant.GRADE_SELECTION_ROUTE,
        component: GradeSelectionComponent
    },
    {
        path: RouteConstant.SUBJECT_SELECTION_ROUTE,
        component: SubjectSelectionComponent
    },
    {
        path: RouteConstant.MATERIAL_SELECTION_ROUTE,
        component: MaterialSelectionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialRoutingModule {}
