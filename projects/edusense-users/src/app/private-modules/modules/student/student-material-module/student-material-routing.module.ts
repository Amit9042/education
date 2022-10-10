import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentMaterialListComponent, StudentSubjectSelectionComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        component: StudentSubjectSelectionComponent
    },
    {
        path: RouteConstant.STUDENT_MATERIAL_LIST_ROUTE,
        component: StudentMaterialListComponent
    },
    {
        path: RouteConstant.STUDENT_SUBJECT_SELECTION_ROUTE,
        component: StudentSubjectSelectionComponent
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentMaterialRoutingModule {}
