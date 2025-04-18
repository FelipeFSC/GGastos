import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utils } from 'src/app/util/utils';

@Component({
    selector: 'app-releases-dialog',
    templateUrl: './releases-dialog.component.html',
    styleUrls: ['./releases-dialog.component.css']
})
export class ReleasesDialogComponent implements OnInit {

    tittle: string = "";

    divideType: string = "";

    isRepeatActive:boolean = false;

    isChatActive:boolean = false;

    isAttachmentActive: boolean = false;

    description: string = "";

    paymentValue: string = "R$";

    paymentDate: any = {};

    valorParcela: number|null = null;

    installmentValue: string = "0.00";

    category = "FUNCIONOU";

    accountAndCreditCards: any[] = [];

    categorySubCategoryList: any[] = [];

    paymentRange: any[] = [];

    paymentRangeSelected: any = {};

    accountSelected: any = {};

    categorySelected: any = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ReleasesDialogComponent>
    ) { }

    ngOnInit(): void {
        this.tittle = this.data.title;
        this.paymentRange = this.data.recurrencesTypes;
        this.categorySubCategoryList = this.data.categories;

        if (this.data.editData) {
            this.onLoadData(this.data.editData);
        } else {
            this.onLoadAccountsCombo(this.data.accounts);
        }
    }

    onLoadData(data: any) {
        this.description = data.description;

        if (data.value < 0) {
            data.value = data.value * -1;
        }
        this.paymentValue = "R$ " + data.value.toFixed(2);
        this.paymentDate = data.transactionDate;


        for (let category of this.categorySubCategoryList) {
            if (category.category.id === data.category.id) {
                this.categorySelected = category.category;
            }
        }

        let accountList = this.data.accounts;
        let list = [];
        let accounts = { name: "Contas", list: [{}]};
        accounts.list.pop();
        for (let account of accountList) {
            accounts.list.push(account.account);

            if (data.account.id === account.account.id) {
                this.accountSelected = account.account;
            }
        }
        list.push(accounts);
        let creditCards = { name: "Cartões", list: [{}] };
        creditCards.list.pop();
        for (let account of accountList) {
            for (let creditCard of account.creditCards) {
                creditCards.list.push(creditCard);
            }
        }
        list.push(creditCards);
        this.accountAndCreditCards = list;

        if (data.recurrenceType) {
            this.isRepeatActive = true;
            this.divideType = "fixed"

            this.paymentRange.forEach((item) => {
                if (data.recurrenceType.id === item.id) {
                    this.paymentRangeSelected = item;
                }
            });
        }

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


    onRepeat() {
        this.isRepeatActive = !this.isRepeatActive;
    }

    onChat() {
        this.isChatActive = !this.isChatActive;
    }

    onAttachment() {
        this.isAttachmentActive = !this.isAttachmentActive;
    }

    valorAlterado() {
        let numberValue = 1;

        if (this.paymentValue) {
            numberValue = Utils.getMoneyValue(this.paymentValue);
        }

        if (this.valorParcela) {
            let result = numberValue / this.valorParcela;
            this.installmentValue = result.toFixed(2);
        }
    }
    
    onSave() {
        let moneyValue;
        moneyValue = Utils.getMoneyValue(this.paymentValue);
        
        let categoryId = 0;
        let subCategoryId = 0;
        if (this.categorySelected.category) {
            subCategoryId = this.categorySelected.id;
        } else if (this.categorySelected.id) {
            categoryId = this.categorySelected.id
        }

        let creditCardId = 0;
        let accountId = 0;
        if (this.accountSelected.cardLimit) {
            creditCardId = this.accountSelected.id;
        } else if (this.accountSelected.id) {
            accountId = this.accountSelected.id;
        }

        let releaseData = {
            value: moneyValue,
            description: this.description,
            transactionType: "",
            paidDate: "",
            transactionDate: this.paymentDate,
            observation: "",
            recurrenceType: {},
            account: {
                id: accountId
            },
            creditCard: {
                id: creditCardId
            },
            category: {
                id: categoryId
            },
            subCategory: {
                id: subCategoryId
            }
        }

        if (this.isRepeatActive) {
            releaseData.recurrenceType = {id: this.paymentRangeSelected.id};
        }

        console.log(this.categorySelected);
        this.dialogRef.close(releaseData);
    }

}
