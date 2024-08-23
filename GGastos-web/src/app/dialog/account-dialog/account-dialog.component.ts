import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-account-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent implements OnInit {

    category: any = {id: 0, icon: "account_balance_wallet", color: "#9d02d9", name: "NuBank"};

    styleColor: any = {'background-color':this.category.color};


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
    }

    onLoad(data: any) {
        this.category.id = data.id;
        this.category.icon = data.icon;
        this.category.color = data.color;
        this.category.name = data.name;

        this.styleColor = {'background-color':data.color};
    }

    changeColor() {
        this.styleColor = {'background-color':this.category.color};
    }

    onClose() {
        // this.dialogRef.close();
    }

}
