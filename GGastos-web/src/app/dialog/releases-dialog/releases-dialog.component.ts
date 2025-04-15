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

    paymentRange: any[] = [
        {name: 'Anual'},
        {name: 'Semestral'},
        {name: 'Trimestral'},
        {name: 'Bimestral'},
        {name: 'Mensal'},
        {name: 'Quinzenal'},
        {name: 'Semanal'},
        {name: 'Diário'},
    ];

    accountSelected: any = {};

    categorySelected: any = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ReleasesDialogComponent>
    ) { }

    ngOnInit(): void {
        this.tittle = this.data.title;

        this.categorySubCategoryList = this.data.categories;
        this.onLoadAccountsCombo(this.data.accounts);
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
        
        let releaseData = {
            amount: moneyValue,
            description: this.description,
            paidDate: "",
            paymentDate: this.paymentDate,
            observation: "",
            user: {
                id: 1
            },
            category: {
                id: 0
            },
            subCategory: {
                id: 0
            }
        }
        

        console.log(this.description);
        console.log(this.paymentDate);
        console.log(moneyValue);

        if (this.accountSelected.cardLimit) {
            console.log("Cartão de credito");
        }
        console.log(this.accountSelected);
        

        if (this.categorySelected.category) {
            console.log("Sub categoria");
        }
        console.log(this.categorySelected);


        console.log(releaseData);


//        this.dialogRef.close(null);
    }

}
