import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AssignmentCompletedViewComponent,
    StudentAssignmentListComponent,
    StudentAssignmentViewComponent
} from './components';
import { RouteConstant } from '@sharedModule/constants';
import {
    StudentAssignmentListResolverService,
    StudentAssignmentViewResolverService,
    StudentSubmittedAssignmentViewService
} from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: StudentAssignmentListComponent,
        resolve: {
            resolvedData: StudentAssignmentListResolverService
        }
    },
    {
        path: RouteConstant.STUDENT_ASSIGNMENT_LIST_ROUTE,
        component: StudentAssignmentListComponent,
        resolve: {
            resolvedData: StudentAssignmentListResolverService
        }
    },
    {
        path: RouteConstant.STUDENT_ASSIGNMENT_VIEW_ROUTE + '/:aId',
        component: StudentAssignmentViewComponent,
        resolve: {
            resolvedData: StudentAssignmentViewResolverService
        }
    },
    {
        path: RouteConstant.STUDENT_ASSIGNMENT_COMPLETED_ROUTE + '/:aId/:sId',
        component: AssignmentCompletedViewComponent,
        resolve: {
            resolvedData: StudentSubmittedAssignmentViewService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentAssignmentRoutingModule {}
