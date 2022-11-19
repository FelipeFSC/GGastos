import { CategoryComponent } from "./category.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CategoryRegisterComponent } from "./category-register/category-register.component";

const categoryRoutes: Routes = [
    {
        path:'',
        component: CategoryComponent
    },
    {
        path:'register',
        component: CategoryRegisterComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(categoryRoutes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule {

}