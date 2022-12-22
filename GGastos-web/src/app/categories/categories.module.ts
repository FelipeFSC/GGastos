import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';

@NgModule({
    declarations: [
        CategoriesComponent
    ],
    imports: [
        CategoriesRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
    ]
})
export class CategoriesModule { }
