import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    StudentDoubtListComponent,
    StudentAllDoubtsComponent,
    StudentAllBookmarkDoubtsComponent,
    AskDoubtSelectSubjectComponent,
    StudentQuestionAnswerComponent
} from './components';
import { RouteConstant } from '@sharedModule/constants';

const routes: Routes = [
    {
        path: '',
        component: StudentDoubtListComponent
    },
    {
        path: RouteConstant.STUDENT_ENROLLMENT_STATUS_LIST_ROUTE,
        component: StudentDoubtListComponent
    },
    {
        path: RouteConstant.STUDENT_ALL_DOUBTS_ROUTE,
        component: StudentAllDoubtsComponent
    },
    {
        path: RouteConstant.STUDENT_ALL_BOOKMARK_DOUBTS_ROUTE,
        component: StudentAllBookmarkDoubtsComponent
    },
    {
        path: RouteConstant.ASK_DOUBT_SELECT_SUBJECT_ROUTE,
        component: AskDoubtSelectSubjectComponent
    },
    {
        path: RouteConstant.STUDENT_QUESTION_ANSWER_ROUTE + '/:id',
        component: StudentQuestionAnswerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentDoubtsRoutingModule {}
