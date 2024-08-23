import { Component, OnInit } from '@angular/core';
import { AccountDialogComponent } from '../dialog/account-dialog/account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Account } from './account.model';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

    account: Account = {
        id: 0,
        name: '',
        icon: '',
        color: '',
    };

    onEditEcreen: boolean = false;

    data: any = [
        {
            nome: "Banco 1",
            image: "Foto 1",
        },
        {
            nome: "Banco BCT",
            image: "Foto 1",
        },
        {
            nome: "Nu Bancos",
            image: "Foto 1",
        },
        {
            nome: "Piracantuba Bancos",
            image: "Foto 1",
        },
    ]

    constructor(
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    onList() {
        this.onEditEcreen = false;
    }
    
    onEdit(numero: string) {
        this.onEditEcreen = true;

        console.log(numero);
    }

    onAddAccount() {
        let dialogRef = this.dialog.open(AccountDialogComponent, {
            data: { title: "Nova despesa" }
        });
    }

}
