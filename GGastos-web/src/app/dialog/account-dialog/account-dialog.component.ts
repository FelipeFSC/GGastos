import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-account-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent implements OnInit {

    account: any = {id: 0, icon: "account_balance_wallet", color: "#9d02d9", name: "NuBank", notInTotal: false};

    styleColor: any = {'background-color':this.account.color};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AccountDialogComponent>
    ) { }

    ngOnInit(): void {
        this.onLoad(this.data.data);
    }

    onLoad(data: any) {

        if (data) {
            this.account.id = data.id;
            this.account.icon = data.icon;
            this.account.color = data.color;
            this.account.name = data.name;
            this.account.notInTotal = data.notInTotal;

            this.styleColor = {'background-color':data.color};
        }
    }

    changeColor() {
        this.styleColor = {'background-color':this.account.color};
    }

    onClose() {
        this.account.name = null;
        this.dialogRef.close(null);
    }

    onSave(form: NgForm) {
        if (form.valid) {
            this.dialogRef.close(this.account);
        }
    }

}
