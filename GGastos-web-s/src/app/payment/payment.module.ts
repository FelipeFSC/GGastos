import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponentsModule } from '../my-components/my-components.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaterialModule,
        MyComponentsModule
    ]
})
export class PaymentModule { }
