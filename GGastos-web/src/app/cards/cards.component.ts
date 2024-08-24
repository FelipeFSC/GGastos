import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExtractDataService } from '../extract-data.service';
import { CardDialogComponent } from '../dialog/card-dialog/card-dialog.component';
import { CardsService } from './cards.service';
import { Card } from './card.model';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/account.model';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

    onEditEcreen: boolean = false;

    selectedCard: Card = {};

    data: any = []

    constructor(
        private dialog: MatDialog,
        private cardsService: CardsService,
        private accountsService: AccountsService,
        private extractDataService: ExtractDataService
    ) { }

    ngOnInit(): void {
        this.onList();
    }

    onList() {
        this.onEditEcreen = false;

        let success = (res: any) => {
            console.log(res);
            let list: Card[] = [];
            for (let item of res) {
                let account = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color,
                    cardLimit: item.cardLimit,
                    closingDate: item.closingDate,
                    dueDate: item.dueDate,
                    enabled: item.enabled,
                    account: item.account
                }
                list.push(account);
            }

            this.data = list;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.cardsService.findByEnabled(true)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onAddCard(card: any) {
        let success = (res: any) => {
            this.openDialog(res, card);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findByEnabled(true)
            .subscribe(this.extractDataService.extract(success, err));
    }

    openDialog(accountList: Account[], card: Card) {
        let dialogRef = this.dialog.open(CardDialogComponent, {
            data: { title: "Nova conta", accountList: accountList, data: card }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) {
                return;
            }

            let card: Card = {
                id: result.id,
                name: result.name,
                icon: result.icon,
                color: result.color,
                cardLimit: result.cardLimit,
                closingDate: result.closingDate,
                dueDate: result.dueDate,
                account: {
                    id: result.account
                }
            }
            this.onSave(card);
        });
    }

    onOpenList() {
        this.onEditEcreen = false;
    }

    onOpenEdit(card: Card) {
        this.selectedCard = card;
        this.onEditEcreen = true;
    }

    onSave(card: Card) {
        let success = () => {
            this.onList();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.cardsService.create(card)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onEdit(account: any) {
        let success = () => {
            this.onOpenEdit(account.id);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.cardsService.update(account.id, account)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onDisable(accountId: number) {
        let success = () => {
            this.onList();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.cardsService.delete(accountId)
            .subscribe(this.extractDataService.extract(success, err));
    }
}
