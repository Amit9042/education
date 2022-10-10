import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueBankGradeComponent, QueBankSubjectComponent, QueBankChapterListComponent, QuestionBankQueListComponent, QuestionPreviewComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';


const routes: Routes = [
  {
    path: '',
    component: QueBankGradeComponent
},
{
    path: RouteConstant.QUE_BANK_GRADE_ROUTE,
    component: QueBankGradeComponent
},
{
    path: RouteConstant.QUE_BANK_SUBJECT_ROUTE,
    component: QueBankSubjectComponent
},
{
  path: RouteConstant.QUE_BANK_CHAPTER_LIST_ROUTE,
  component: QueBankChapterListComponent
},
{
  path: RouteConstant.QUE_BANK_QUE_LIST_ROUTE,
  component: QuestionBankQueListComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionBankRoutingModule { }
