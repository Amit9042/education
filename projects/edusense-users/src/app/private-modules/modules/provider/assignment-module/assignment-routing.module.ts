import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AssignmentListComponent,
    AssignmentSubmissionViewComponent,
    AssignmentViewComponent
} from './components';
import { RouteConstant } from '@sharedModule/constants';
import {
    AssignmentListResolverService,
    AssignmentSubmissionViewResolverService,
    AssignmentViewResolverService
} from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: AssignmentListComponent,
        resolve: {
            resolvedData: AssignmentListResolverService
        }
    },
    {
        path: RouteConstant.ASSIGNMENT_LIST_ROUTE,
        component: AssignmentListComponent,
        resolve: {
            resolvedData: AssignmentListResolverService
        }
    },
    {
        path: RouteConstant.ASSIGNMENT_VIEW_ROUTE + '/:id',
        component: AssignmentViewComponent,
        resolve: {
            resolvedData: AssignmentViewResolverService
        }
    },
    {
        path: RouteConstant.ASSIGNMENT_SUBMISSION_VIEW_ROUTE + '/:id',
        component: AssignmentSubmissionViewComponent,
        resolve: {
            resolvedData: AssignmentSubmissionViewResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignmentRoutingModule {}
