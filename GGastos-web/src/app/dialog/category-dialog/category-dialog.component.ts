import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.css']
    })
export class CategoryDialogComponent implements OnInit {

    category: any = {
        id: 0,
        icon: "home",
        color: "#0011ff",
        name: "Casa",
        categoryType: "despesa"
    };

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
        this.category.categoryType = data.type;
        this.category.icon = data.icon;
        this.category.color = data.color;
        this.category.name = data.name;

        this.styleColor = {'background-color':data.color};
    }

    changeColor() {
        this.styleColor = {'background-color':this.category.color};
    }

    onClose() {
        this.category.name = null;
        this.dialogRef.close(null);
    }

    onSave(form: NgForm) {
        this.dialogRef.close(this.category);
    }
}
