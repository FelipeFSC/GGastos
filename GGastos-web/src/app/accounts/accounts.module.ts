import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { MyComponentsModule } from '../my-components/my-components.module';
import { MaterialModule } from '../material/material.module';
import { AccountsRoutingModule } from './accounts-routing.module';

@NgModule({
    declarations: [
        AccountsComponent
    ],
    imports: [
        AccountsRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule
    ]
})
export class AccountsModule { }
