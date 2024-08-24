import { Component, OnInit } from '@angular/core';
import { AccountDialogComponent } from '../dialog/account-dialog/account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Account } from './account.model';
import { AccountsService } from './accounts.service';
import { ExtractDataService } from '../extract-data.service';

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
    ]

    constructor(
        private dialog: MatDialog,
        private accountsService: AccountsService,
        private extractDataService: ExtractDataService
    ) { }

    ngOnInit(): void {
        this.onList();
    }

    onList() {
        this.onEditEcreen = false;

        let success = (res: any) => {
            let list: Account[] = [];
            console.log(res)
            for (let item of res) {
                let account = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color,
                    balance: item.balance,
                    enabled: item.enabled,
                    isAddOverall: item.addOverall
                }
                list.push(account);
            }

            this.data = list;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findByEnabled(true)
            .subscribe(this.extractDataService.extract(success, err));


    }

    onEdit(numero: string) {
        this.onEditEcreen = true;

        console.log(numero);
    }

    onAddAccount() {
        let dialogRef = this.dialog.open(AccountDialogComponent, {
            data: { title: "Nova despesa" }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.onSave({});
            }
        });
    }

    onSave(category: any) {
        let account: Account = {
            id: 0,
            name: 'Teste',
            icon: 'home',
            color: 'red',
            balance: 10,
            isAddOverall: false
        };

        let success = (res: any) => {
            //this.list();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.create(account)
            .subscribe(this.extractDataService.extract(success, err));
    }

}
