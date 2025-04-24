import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-teste',
    templateUrl: './teste.component.html',
    styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {

    groupedList: any[] = [];

    categorySubCategoryList: any[] = [];
    accountAndCreditCards: any[] = [];

    categorySelected: any = {};
    accountSelected: any = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<any>
    ) { }

    ngOnInit(): void {
        let list = [];
        for (let item of this.data.expenseCategories) {
            list.push(item);
        }
        for (let item of this.data.incomeCategories) {
            list.push(item);
        }

        this.categorySubCategoryList = list;
        this.onLoadAccountsCombo(this.data.accounts);



        this.groupedList = this.data.groupedList || [];
    }

    onLoadAccountsCombo(data: any) {
        let list = [];

        let accounts = { name: "Contas", list: [{}]};
        accounts.list.pop();
        for (let account of data) {
            accounts.list.push(account.account);
        }
        list.push(accounts);

        let creditCards = { name: "Cartões", list: [{}] };
        creditCards.list.pop();
        for (let account of data) {
            for (let creditCard of account.creditCards) {
                creditCards.list.push(creditCard);
            }
        }
        list.push(creditCards);

        this.accountAndCreditCards = list;
    }


    confirm(): void {
        this.dialogRef.close({
            category: this.categorySelected,
            account: this.accountSelected,
            transactions: this.data.groupedList,
            //originalGroupName: this.selectedGroup?.category
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

}
