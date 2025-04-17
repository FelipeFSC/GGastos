import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleasesComponent } from './releases.component';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { ReleasesRoutingModule } from './releases-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ReleasesComponent
    ],
    imports: [
        ReleasesRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
        FormsModule
    ]
})
export class ReleasesModule { }
