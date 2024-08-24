import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-account-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent implements OnInit {

    account: any = {id: 0, icon: "account_balance_wallet", color: "#9d02d9", name: "NuBank", addOverall: false};

    styleColor: any = {'background-color':this.account.color};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AccountDialogComponent>
    ) { }

    ngOnInit(): void {
        this.onLoad(this.data.data);
    }

    onLoad(data: any) {
        console.log(data);

        if (data) {
            console.log(data);
            this.account.id = data.id;
            this.account.icon = data.icon;
            this.account.color = data.color;
            this.account.name = data.name;
            this.account.addOverall = data.addOverall;

            this.styleColor = {'background-color':data.color};
        }
    }

    changeColor() {
        this.styleColor = {'background-color':this.account.color};
    }

    onClose() {
        this.dialogRef.close();
    }

}
