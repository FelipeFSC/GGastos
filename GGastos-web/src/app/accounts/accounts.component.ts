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

    account: Account = {};

    selectedAccount: Account = {};

    data: Account[] = [];

    onEditEcreen: boolean = false;

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
            for (let item of res) {
                let account = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color,
                    balance: item.balance,
                    enabled: item.enabled,
                    addOverall: item.addOverall
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

    onAddAccount(account: Account | null) {
        let dialogRef = this.dialog.open(AccountDialogComponent, {
            data: { title: "Nova conta", data: account }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) {
                return;
            }
            if (result.id) {
                let account: Account = {
                    id: result.id,
                    name: result.name,
                    icon: result.icon,
                    color: result.color,
                    balance: 0,
                    notInTotal: result.notInTotal
                };

                this.onEdit(account);
            } else {
                let account: Account = {
                    id: result.id,
                    name: result.name,
                    icon: result.icon,
                    color: result.color,
                    notInTotal: result.notInTotal
                };

                this.onSave(account);
            }
        });
    }

    onSave(account: any) {
        let success = () => {
            this.onList();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.create(account)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onEdit(account: any) {
        let success = () => {
            this.onOpenEdit(account.id);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.update(account.id, account)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onOpenEdit(accountId: number) {
        let success = (res: Account) => {
            this.selectedAccount = res;
            this.onEditEcreen = true;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findOne(accountId)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onDisable(accountId: number) {
        let success = () => {
            this.onList();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.disable(accountId)
            .subscribe(this.extractDataService.extract(success, err));
    }
}
