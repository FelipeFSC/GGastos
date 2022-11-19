import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { MaterialModule } from '../material/material.module';
import { CategoryRoutingModule } from './category-routing.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { CategoryRegisterComponent } from './category-register/category-register.component';

@NgModule({
    declarations: [
        CategoryComponent,
        CategoryRegisterComponent
    ],
    imports: [
        CategoryRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule
    ]
})
export class CategoryModule { }
