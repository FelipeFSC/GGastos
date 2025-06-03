import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentsComponent } from './investments.component';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { InvestmentsRoutingModule } from './investments-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [
        InvestmentsComponent
    ],
    imports: [
        InvestmentsRoutingModule,
        CommonModule,
        MaterialModule,
        FormsModule,
        MyComponentsModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
    ]
})
export class InvestmentsModule { }
