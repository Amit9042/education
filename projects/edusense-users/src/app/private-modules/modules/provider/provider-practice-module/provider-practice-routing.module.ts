import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { ChooseGradePracticeComponent, QuestionSelectContainerComponent,
    ChooseSubjectPracticeComponent,
    PracticeListComponent} from './components';

const routes: Routes = [
    {
        path: '',
        component: ChooseGradePracticeComponent
    },
    {
        path: RouteConstant.CHOOSE_GRADE_PRACTICE_ROUTE,
        component: ChooseGradePracticeComponent
    },
    {
        path: RouteConstant.CHOOSE_SUBJECT_PRACTICE_ROUTE,
        component: ChooseSubjectPracticeComponent
    },
    {
        path: RouteConstant.QUESTION_SELECT_PRACTICE_ROUTE,
        component: QuestionSelectContainerComponent
    },
    {
        path: RouteConstant.PRACTICE_LIST_ROUTE,
        component: PracticeListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderPracticeRoutingModule {}
