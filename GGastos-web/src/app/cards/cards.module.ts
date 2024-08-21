import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards.component';
import { MyComponentsModule } from '../my-components/my-components.module';
import { MaterialModule } from '../material/material.module';
import { CardsRoutingModule } from './cards-routing.module';

@NgModule({
    declarations: [
        CardsComponent
    ],
    imports: [
        CardsRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule
    ]
})
export class CardsModule { }
