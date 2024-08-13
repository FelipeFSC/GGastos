
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MaterialModule } from '../material/material.module';
import { SubCategoryDialogComponent } from './sub-category-dialog/sub-category-dialog.component';

@NgModule({
    declarations: [
        CategoryDialogComponent,
        SubCategoryDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
    ],
    entryComponents: [
        CategoryDialogComponent,
        SubCategoryDialogComponent
    ]
})
export class DialogModule { }
