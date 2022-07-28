import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [
        LeftMenuComponent,
        ListComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        LeftMenuComponent,
        ListComponent
    ]
})
export class MyComponentsModule { }
