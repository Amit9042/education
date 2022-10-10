import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    ChapterManagementListComponent,
    ChapterManagementViewComponent
} from './components';
import {
    ChapterManagementListResolverService,
    ChapterManagementViewResolverService
} from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: ChapterManagementListComponent,
        resolve: {
            resolvedData: ChapterManagementListResolverService
        }
    },
    {
        path: RouteConstant.CHAPTER_MANAGEMENT_LIST_ROUTE,
        component: ChapterManagementListComponent,
        resolve: {
            resolvedData: ChapterManagementListResolverService
        }
    },
    {
        path: RouteConstant.CHAPTER_MANAGEMENT_VIEW_ROUTE + '/:id',
        component: ChapterManagementViewComponent,
        resolve: {
            resolvedData: ChapterManagementViewResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChapterManagementRoutingModule {}
