import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentsComponent } from './investments.component';

const investmentsRoutes: Routes = [
    {
        path:'',
        component: InvestmentsComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(investmentsRoutes)],
    exports: [RouterModule]
})
export class InvestmentsRoutingModule { }
