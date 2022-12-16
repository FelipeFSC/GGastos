import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ReleasesComponent } from "./releases.component";

const releasesRoutes: Routes = [
    {
        path:'',
        component: ReleasesComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(releasesRoutes)],
    exports: [RouterModule]
})
export class ReleasesRoutingModule {

}