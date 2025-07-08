import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExtractDataService } from 'src/app/extract-data.service';
import { ReleasesService } from 'src/app/releases/releases.service';
import { Utils } from 'src/app/util/utils';

@Component({
    selector: 'app-releases-dialog',
    templateUrl: './releases-dialog.component.html',
    styleUrls: ['./releases-dialog.component.css']
})
export class ReleasesDialogComponent implements OnInit {

    tittle: string = "";

    editMode: boolean = false;

    divideType: string = "";

    isRepeatActive: boolean = false;

    isChatActive: boolean = false;

    isAttachmentActive: boolean = false;

    description: string = "";

    paymentValue: string = "R$";

    paymentDate: any = {};

    valorParcela: number | null = null;

    installmentValue: string = "0.00";

    category = "FUNCIONOU";

    observation: string | null = null;

    accountAndCreditCards: any[] = [];

    categorySubCategoryList: any[] = [];

    paymentRange: any[] = [];

    paymentRangeSelected: any = null;

    accountSelected: any = null;

    categorySelected: any = null;

    isFixed: boolean = false;

    selectedFile: File | null = null;

    updateType: string = "1";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private releasesService: ReleasesService,
        private extractDataService: ExtractDataService,
        public dialogRef: MatDialogRef<ReleasesDialogComponent>
    ) { }

    ngOnInit(): void {
        this.tittle = this.data.title;
        this.paymentRange = this.data.recurrencesTypes;
        this.categorySubCategoryList = this.data.categories;

        if (this.data.editData) {
            this.editMode = true;
            this.onLoadData(this.data.editData);
        } else {
            this.onLoadAccountsCombo(this.data.accounts);
        }
    }

    onLoadData(data: any) {
        this.description = data.description;

        this.isFixed = data.fixedTransactionId != null;

        if (data.selectedFile) {
            this.selectedFile = data.selectedFile;
            this.isAttachmentActive = !this.isAttachmentActive;
        }

        if (data.observation) {
            this.observation = data.observation;
            this.isChatActive = true;
        }

        if (data.value < 0) {
            data.value = data.value * -1;
        }
        this.paymentValue = "R$ " + data.value.toFixed(2).replace('.', ',');
        this.paymentDate = this.data.currentDate;

        for (let category of this.categorySubCategoryList) {
            if (data.subCategory && category.subCategory.length > 0) {
                let find = false;
                for (let subCategory of category.subCategory) {
                    if (data.subCategory.id == subCategory.id) {
                        this.categorySelected = subCategory;
                        find = true;
                        break;
                    }
                }
                if (find) {
                    break;
                }
            } else {
                if (category.category.id === data.category.id) {
                    this.categorySelected = category.category;
                    break;
                }
            }
        }

        let accountList = this.data.accounts;
        let list = [];
        let accounts = { name: "Contas", list: [{}] };
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
            this.divideType = "fixed"
            this.isFixed = true;
        }

    }

    onLoadAccountsCombo(data: any) {
        let list = [];

        let accounts = { name: "Contas", list: [{}] };
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

    downloadFile(): void {
        let success = (file: any) => {
            const url = window.URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.selectedFile!.name;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.downloadFileById(1)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.isAttachmentActive = !this.isAttachmentActive;

            this.selectedFile = file;
        }
    }

    removeSelectedFile(): void {
        this.selectedFile = null;
        this.isAttachmentActive = !this.isAttachmentActive;

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
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

    onDelete() {
        let editData = {
            id: this.data.editData.id,
            updateType: this.updateType
        }
        this.dialogRef.close(editData);
    }

    onSave(form: NgForm) {
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

        let observation = this.observation;
        if (!this.isChatActive) {
            observation = null;
        }

        let releaseData = {
            updateType: this.updateType,
            value: moneyValue,
            description: this.description,
            transactionType: "",
            paidDate: "",
            transactionDate: this.paymentDate,
            observation: observation,
            selectedFile: this.selectedFile,
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
            releaseData.recurrenceType = { id: this.paymentRangeSelected.id };
        }

        this.dialogRef.close(releaseData);
    }

}
