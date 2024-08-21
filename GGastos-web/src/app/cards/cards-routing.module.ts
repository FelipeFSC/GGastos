import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CardsComponent } from "./cards.component";

const cardsRoutes: Routes = [
    {
        path:'',
        component: CardsComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(cardsRoutes)],
    exports: [RouterModule]
})

export class CardsRoutingModule {

}