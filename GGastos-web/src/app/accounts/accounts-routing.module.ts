import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AccountsComponent } from "./accounts.component";

const accountsRoutes: Routes = [
    {
        path:'',
        component: AccountsComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(accountsRoutes)],
    exports: [RouterModule]
})

export class AccountsRoutingModule {

}