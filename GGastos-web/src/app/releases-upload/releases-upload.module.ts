import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MyComponentsModule } from '../my-components/my-components.module';
import { FormsModule } from '@angular/forms';
import { ReleasesUploadComponent } from './releases-upload.component';
import { ReleasesUploadRoutingModule } from './releases-upload-routing.module';

@NgModule({
    declarations: [
        ReleasesUploadComponent
    ],
    imports: [
        ReleasesUploadRoutingModule,
        CommonModule,
        MaterialModule,
        MyComponentsModule,
        FormsModule
    ]
})
export class ReleasesUploadModule { }
