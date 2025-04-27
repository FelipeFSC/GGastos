import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { SpendingLimitComponent } from './spending-limit.component';
import { SpendingLimitRoutingModule } from './spending-limit-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        SpendingLimitComponent
    ],
    imports: [
        SpendingLimitRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
        FormsModule,
        NgxEchartsModule.forRoot({
			echarts: () => import('echarts'),
		}),
    ]
})
export class SpendingLimitModule { }
