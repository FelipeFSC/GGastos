import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { HomeRoutingModule } from './home-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        HomeRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
        NgxEchartsModule.forRoot({
			echarts: () => import('echarts'),
		}),
    ]
})
export class HomeModule { }
