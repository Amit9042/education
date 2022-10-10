import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StudentStreamingComponent } from "./components";

const routes: Routes = [
  {
    path: "",
    component: StudentStreamingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinClassRoutingModule {}
