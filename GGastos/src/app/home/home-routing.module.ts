import { HomeComponent } from './home.component';
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const homeRoutes: Routes = [
    { path:'', component: HomeComponent }
]

@NgModule({
    imports: [RouterModule.forChild(homeRoutes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {

}