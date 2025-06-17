import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/cards/card.model';
import { Utils } from 'src/app/util/utils';

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
            this.card.id = data.id;
            this.card.name = data.name;
            this.card.icon = data.icon;
            this.card.color = data.color;
            this.card.cardLimit = data.cardLimit;
            this.card.closingDate = data.closingDate;
            this.card.dueDate = data.dueDate;
            this.card.enabled = data.enabled;
            // this.card.account = data.account;

            this.value = "R$ " + data.cardLimit.toFixed(2);

            for (let item of this.days) {
                if (item === this.card.dueDate) {
                    this.card.dueDate = item;
                }
            }

            for (let item of this.accounts) {
                if (item.id === data.account.id) {
                    this.card.account = (item);
                }
            }

            this.styleColor = {'background-color':data.color};
        }
    }

    changeColor() {
        this.styleColor = {'background-color':this.card.color};
    }

    onSave(form: NgForm) {
        if (form.valid) {
            let numberValue = 1;
            if (this.value) {
                numberValue = Utils.getMoneyValue(this.value);
            }
            this.card.cardLimit = numberValue;

            this.dialogRef.close(this.card);
        }
    }

    onClose() {
        this.dialogRef.close(null);
    }

}
