import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    ChooseSubjectPracticeComponent,
    PracticeChapterComponent,
    PracticeListComponent,
    StudentBookmarkQuestionComponent,
    StudentPracticeDetailsContainerComponent
} from './components';
import {
    ChooseSubjectPracticeResolverService,
    PracticeChapterResolverService,
    StudentBookmarkQuestionResolverService,
    StudentPracticeDetailResolverService
} from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: ChooseSubjectPracticeComponent,
        resolve: {
            resolvedData: ChooseSubjectPracticeResolverService
        }
    },
    {
        path: RouteConstant.CHOOSE_SUBJECT_STUDENT_PRACTICE_ROUTE,
        component: ChooseSubjectPracticeComponent,
        resolve: {
            resolvedData: ChooseSubjectPracticeResolverService
        }
    },
    {
        path: RouteConstant.PRACTICE_LIST_STUDENT_ROUTE + '/:id/:cId',
        component: PracticeListComponent
    },
    {
        path: RouteConstant.PRACTICE_QUESTION_STUDENT_ROUTE + '/:id',
        component: StudentPracticeDetailsContainerComponent,
        resolve: {
            resolvedData: StudentPracticeDetailResolverService
        }
    },
    {
        path: RouteConstant.STUDENT_BOOKMARK_QUESTION_ROUTE,
        component: StudentBookmarkQuestionComponent,
        resolve: {
            resolvedData: StudentBookmarkQuestionResolverService
        }
    },
    {
        path: RouteConstant.PRACTICE_CHAPTER_STUDENT_ROUTE + '/:id',
        component: PracticeChapterComponent,
        resolve: {
            resolvedData: PracticeChapterResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentPracticeRoutingModule {}
