
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MaterialModule } from '../material/material.module';
import { SubCategoryDialogComponent } from './sub-category-dialog/sub-category-dialog.component';
import { ReleasesDialogComponent } from './releases-dialog/releases-dialog.component';
import { CurrencyMaskDirective } from './currency-mask.directive';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { CardDialogComponent } from './card-dialog/card-dialog.component';
import { TesteComponent } from './teste/teste.component';
import { SpendingLimitDialogComponent } from './spending-limit-dialog/spending-limit-dialog.component';

@NgModule({
    declarations: [
        CurrencyMaskDirective,
        CategoryDialogComponent,
        SubCategoryDialogComponent,
        ReleasesDialogComponent,
        AccountDialogComponent,
        CardDialogComponent,
        TesteComponent,
        SpendingLimitDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
    ],
    entryComponents: [
        CategoryDialogComponent,
        SubCategoryDialogComponent,
        AccountDialogComponent,
        ReleasesDialogComponent,
        CardDialogComponent,
        SpendingLimitDialogComponent,
    ]
})
export class DialogModule { }
