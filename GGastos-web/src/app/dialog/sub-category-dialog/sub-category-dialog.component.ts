import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-category-dialog',
  templateUrl: './sub-category-dialog.component.html',
  styleUrls: ['./sub-category-dialog.component.css']
})
export class SubCategoryDialogComponent implements OnInit {

	selectedValue: any = null;

  	category: any = {id: 0, name: "", categoryId: 0};

    subCategory: any = {id: 0, name: "", categoryId: 0};

    styleColor: any = {'background-color':this.category.color};

    isDelete: boolean = false;

	categories: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SubCategoryDialogComponent>
    ) { }

    ngOnInit(): void {
		this.categories = this.data.categories;

        if (this.data.edit) {
            this.onLoad(this.data.edit, this.categories);
        }
    }

    onLoad(subCategory: any, category: any) {
        this.category.id = category.id;
        this.category.icon = category.icon;
        this.category.color = category.color;
        this.category.name = category.name;

        this.subCategory.id = subCategory.id;
        this.subCategory.name = subCategory.name;

        this.styleColor = {'background-color':category.color};
    }

    onSelect() {
        this.category.categoryId = this.selectedValue.id;
    }

    changeColor() {
        this.styleColor = {'background-color':this.category.color};
    }

    onClose() {
        this.dialogRef.close();
    }


}
