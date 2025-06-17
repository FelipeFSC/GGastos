import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ReleasesComponent } from "./releases.component";
import { ReleasesUploadComponent } from "./releases-upload/releases-upload.component";

const releasesRoutes: Routes = [
    {
        path:'',
        component: ReleasesComponent
    },
    {
        path: 'upload',
        component: ReleasesUploadComponent
    },
]

@NgModule({
    imports: [RouterModule.forChild(releasesRoutes)],
    exports: [RouterModule]
})
export class ReleasesRoutingModule {

}