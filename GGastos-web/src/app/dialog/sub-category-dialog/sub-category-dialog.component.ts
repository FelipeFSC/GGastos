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
            this.isDelete = true;
            this.onLoad(this.data.edit);
        }
    }

    onLoad(data: any) {
        this.category.id = data.id;
        this.category.icon = data.icon;
        this.category.color = data.color;
        this.category.name = data.name;

        this.styleColor = {'background-color':data.color};
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
