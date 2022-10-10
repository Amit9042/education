import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentListComponent, StudentProfileComponent } from "./components";
import { StudentRoutingModule } from "./student-routing.module";
import { SharedModule } from '@sharedModule/shared.module';

@NgModule({
  declarations: [StudentListComponent, StudentProfileComponent],
  imports: [CommonModule,SharedModule, StudentRoutingModule],
})
export class StudentModule {}
