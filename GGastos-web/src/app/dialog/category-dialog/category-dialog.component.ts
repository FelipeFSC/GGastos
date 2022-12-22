import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.css']
    })
export class CategoryDialogComponent implements OnInit {

    category: any = {id: 0, icone: "", color: "#0011ff", name: ""};

    styleColor: any = {'background-color':this.category.color};

    isDelete: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CategoryDialogComponent>
    ) { }

    ngOnInit(): void {
        if (this.data.edit) {
            this.isDelete = true;
            this.onLoad(this.data.edit);
        }
    }

    onLoad(data: any) {
        this.category.id = data.id;
        this.category.icone = data.icone;
        this.category.color = data.color;
        this.category.name = data.name;
    }

    changeColor() {
        this.styleColor = {'background-color':this.category.color};
    }

    onClose() {
        this.dialogRef.close();
    }

}
