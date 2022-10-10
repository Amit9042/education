import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import {
    RecievedDoubtsComponent,
    AllDoubtsComponent,
    QuestionAnswerComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        component: RecievedDoubtsComponent
    },
    {
        path: RouteConstant.PROVIDER_RECIEVED_DOUBTS_ROUTE,
        component: RecievedDoubtsComponent
    },
    {
        path: RouteConstant.PROVIDER_ALL_DOUBTS_ROUTE,
        component: AllDoubtsComponent
    },
    {
        path: RouteConstant.PROVIDER_QUESTION_ANSWER_ROUTE + '/:id',
        component: QuestionAnswerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderDoubtRoutingModule {}
