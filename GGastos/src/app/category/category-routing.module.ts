import { CategoryComponent } from "./category.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const categoryRoutes: Routes = [
    {
        path:'',
        component: CategoryComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(categoryRoutes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule {

}