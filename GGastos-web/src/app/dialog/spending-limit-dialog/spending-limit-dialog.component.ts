import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-spending-limit-dialog',
    templateUrl: './spending-limit-dialog.component.html',
    styleUrls: ['./spending-limit-dialog.component.css']
})
export class SpendingLimitDialogComponent implements OnInit {

    categorySelected: any = {};

    categorySubCategoryList: any[] = [];

    limite: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SpendingLimitDialogComponent>
    ) { }

    ngOnInit(): void {
        this.categorySubCategoryList = this.data.categories;
    }

    onSave() {
        let spendingLimit = {
            spentLimit: this.limite,
            spent: 0,
            filterDate: 0,
            category: {id: this.categorySelected.id},
        };

        this.dialogRef.close(spendingLimit);
    }
    
    onClose() {
        this.dialogRef.close();
    }
}
