import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CategoriesComponent
    ],
    imports: [
        CategoriesRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
        FormsModule,
    ]
})
export class CategoriesModule { }
