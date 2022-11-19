import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { ListComponent } from './list/list.component';
import { ActionComponent } from './action/action.component';

@NgModule({
    declarations: [
        LeftMenuComponent,
        ListComponent,
        ActionComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        LeftMenuComponent,
        ListComponent,
        ActionComponent
    ]
})
export class MyComponentsModule { }
