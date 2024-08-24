import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/cards/card.model';

@Component({
    selector: 'app-card-dialog',
    templateUrl: './card-dialog.component.html',
    styleUrls: ['./card-dialog.component.css']
})
export class CardDialogComponent implements OnInit {

    card: any = {id: 0, icon: "home", color: "#0011ff"};

    days = Array.from({ length: 30 }, (_, index) => index + 1);

    accounts: any = [];

    styleColor: any = {'background-color':this.card.color};

    value: string = "R$";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CardDialogComponent>
    ) { }

    ngOnInit(): void {
        this.accounts = this.data.accountList;
        this.onLoad(this.data.data);
    }

    onLoad(data: any) {
        if (data) {
            //this.account.id = data.id;
            //this.account.icon = data.icon;
            //this.account.color = data.color;
            //this.account.name = data.name;
            //this.account.addOverall = data.addOverall;

           //this.styleColor = {'background-color':data.color};
        }
    }

    changeColor() {
        this.styleColor = {'background-color':this.card.color};
    }

    onSave() {
        let numberValue = 1;

        if (this.value) {
            let value: string = this.value.replace("R$", "");
            value = value.replace(".", "");
            value = value.replace(",", ".");
            numberValue = Number(value);
        }
        this.card.cardLimit = numberValue;

        this.dialogRef.close(this.card);
    }

    onClose() {
        this.dialogRef.close();
    }

}
