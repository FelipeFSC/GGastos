import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CategoriesComponent } from "./categories.component";

const categoriesRoutes: Routes = [
    {
        path:'',
        component: CategoriesComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(categoriesRoutes)],
    exports: [RouterModule]
})
export class CategoriesRoutingModule {

}