import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentEnrollmentstatusListComponent } from './components';
import { RouteConstant } from '@sharedModule/constants';


const routes: Routes = [
  {
    path: "",
    component: StudentEnrollmentstatusListComponent,
  },
  {
    path: RouteConstant.STUDENT_ENROLLMENT_STATUS_LIST_ROUTE,
    component: StudentEnrollmentstatusListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEnrollmentStatusRoutingModule { }
