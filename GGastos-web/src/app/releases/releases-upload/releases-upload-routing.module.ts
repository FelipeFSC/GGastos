import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ReleasesUploadComponent } from "./releases-upload.component";

const releasesUploadRoutes: Routes = [
    {
        path:'',
        component: ReleasesUploadComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(releasesUploadRoutes)],
    exports: [RouterModule]
})
export class ReleasesUploadRoutingModule {

}