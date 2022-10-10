import { RouteConstant } from './../../../../shared-module/constants/app-routes.constants';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentRecordedListComponent, StudentRecordedViewComponent } from './components';


const routes: Routes = [
  {
    path: '',
    component: StudentRecordedListComponent
  },
  {
    path: RouteConstant.STUDENT_RECORDED_SESSION_LIST_ROUTE,
    component: StudentRecordedListComponent
  },
  {
    path: RouteConstant.STUDENT_RECORDED_SESSION_VIEW_ROUTE,
    component: StudentRecordedViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRecordedSessionRoutingModule { }
