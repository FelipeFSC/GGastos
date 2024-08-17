
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MaterialModule } from '../material/material.module';
import { SubCategoryDialogComponent } from './sub-category-dialog/sub-category-dialog.component';
import { ReleasesDialogComponent } from './releases-dialog/releases-dialog.component';

@NgModule({
    declarations: [
        CategoryDialogComponent,
        SubCategoryDialogComponent,
        ReleasesDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
    ],
    entryComponents: [
        CategoryDialogComponent,
        SubCategoryDialogComponent,
        ReleasesDialogComponent
    ]
})
export class DialogModule { }
