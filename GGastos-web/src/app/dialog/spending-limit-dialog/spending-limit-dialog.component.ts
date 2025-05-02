import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-spending-limit-dialog',
    templateUrl: './spending-limit-dialog.component.html',
    styleUrls: ['./spending-limit-dialog.component.css']
})
export class SpendingLimitDialogComponent implements OnInit {

    categorySelected: any = {};

    editMode: boolean = false;

    icon: any = {color: "", icon: "", title: ""};

    categorySubCategoryList: any[] = [];

    limite: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SpendingLimitDialogComponent>
    ) { }

    ngOnInit(): void {
        this.categorySubCategoryList = this.data.categories;
        if (this.data.editData) {
            console.log("edit mode");
            this.onLoadData(this.data.editData);
        }
    }

    onLoadData(data: any) {
        this.limite = data.limit;
        this.icon.color = data.color;
        this.icon.icon = data.icon;
        this.icon.title = data.title;
        this.editMode = true;

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
