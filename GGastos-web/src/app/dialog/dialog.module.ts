
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
    declarations: [
        CategoryDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
    ],
    entryComponents: [
        CategoryDialogComponent,
    ]
})
export class DialogModule { }
