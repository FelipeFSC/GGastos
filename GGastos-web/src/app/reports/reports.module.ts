import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { CategoryReportComponent } from './category-report/category-report.component';
import { InputOutputReportComponent } from './input-output-report/input-output-report.component';
import { AccountReportComponent } from './account-report/account-report.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [
        ReportsComponent,
        CategoryReportComponent,
        InputOutputReportComponent,
        AccountReportComponent
    ],
    imports: [
        ReportsRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
        NgxEchartsModule.forRoot({
			echarts: () => import('echarts'),
		}),
    ]
})
export class ReportsModule { }
