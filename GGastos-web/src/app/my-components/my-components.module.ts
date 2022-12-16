import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { ActionComponent } from './action/action.component';

@NgModule({
    declarations: [
        LeftMenuComponent,
        ActionComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        LeftMenuComponent,
        ActionComponent
    ]
})
export class MyComponentsModule { }
