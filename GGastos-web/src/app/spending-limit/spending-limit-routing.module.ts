import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SpendingLimitComponent } from "./spending-limit.component";

const spendingLimitRoutes: Routes = [
    {
        path:'',
        component: SpendingLimitComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(spendingLimitRoutes)],
    exports: [RouterModule]
})

export class SpendingLimitRoutingModule {

}