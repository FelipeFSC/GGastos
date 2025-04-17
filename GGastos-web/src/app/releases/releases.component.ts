import { Component, OnInit } from '@angular/core';
import { ReleasesDialogComponent } from '../dialog/releases-dialog/releases-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from '../categories/categories.service';
import { ReleasesService } from './releases.service';

@Component({
    selector: 'app-releases',
    templateUrl: './releases.component.html',
    styleUrls: ['./releases.component.css']
})

export class ReleasesComponent implements OnInit {

    modeloDados: any = [];

    saldo: number = 0;
    previsto: number = 0;

    constructor(
        private accountsService: AccountsService,
        private dialog: MatDialog,
        private extractDataService: ExtractDataService,
        private categoriesService: CategoriesService,
        private releasesService: ReleasesService
    ) { }

    ngOnInit(): void {
        this.onList();
    }

    onList() {
        let success = (res: any) => {
            let list: any = [];

            this.saldo = 0;
            this.previsto = 0;

            let gastos = [];
            let beforeDay;
            for (let item of res) {
                let day = new Date(item.transactionDate).getDate();

                if (item.transactionType.id === 1) {
                    this.saldo += item.amount;
                } else {
                    this.previsto -= item.amount;
                }

                let gasto = {
                    id: item.id,
                    icone: item.category.icon,
                    cor: item.category.color,
                    isAnotacao: "Sempre bom",
                    isAnexo: {
                        id: 14,
                        nome: "folha de pagamento.pdf"
                    },
                    isFixo: true,

                    nameCategoria: item.description,
                    tipoConta: item.account.name,
                    valor: item.amount.toFixed(2)
                };

                if (day != beforeDay && beforeDay) {
                    list.push({
                        data: beforeDay,
                        gastos: gastos
                    });
                    gastos = [];
                    gastos.push(gasto);

                } else {
                    gastos.push(gasto);
                }

                beforeDay = day;
            }
            list.push({
                data: beforeDay,
                gastos: gastos
            });

            this.modeloDados = list;

            this.previsto = (this.saldo - this.previsto);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.findAll()
            .subscribe(this.extractDataService.extract(success, err));
    }

    onExpense() {
        let success = (accountsCreditCards: any) => {

            let success = (categoriesSubCategories: any) => {
                let dialogRef = this.dialog.open(ReleasesDialogComponent, {
                    data: { 
                        title: "Nova despesa",
                        accounts: accountsCreditCards,
                        categories: categoriesSubCategories
                    }
                });
        
                dialogRef.afterClosed().subscribe((result: any) => {
                    result.amount = result.amount * -1;
                    result.transactionType = {id: 2};
                    this.onCreate(result);
                });
            }
    
            let err = (error: any) => {
                console.log(error);
            }
    
            this.categoriesService.findAll()
                .subscribe(this.extractDataService.extract(success, err));

        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findAllAccountsAndCreditCards()
            .subscribe(this.extractDataService.extract(success, err));
    }

    onRevenue() {
        let success = (accountsCreditCards: any) => {

            let success = (categoriesSubCategories: any) => {
                let dialogRef = this.dialog.open(ReleasesDialogComponent, {
                    data: { 
                        title: "Nova receita",
                        accounts: accountsCreditCards,
                        categories: categoriesSubCategories
                    }
                });
        
                dialogRef.afterClosed().subscribe((result: any) => {
                    result.transactionType = {id: 1};
                    this.onCreate(result);
                });
            }
    
            let err = (error: any) => {
                console.log(error);
            }
    
            this.categoriesService.findAll()
                .subscribe(this.extractDataService.extract(success, err));

        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findAllAccountsAndCreditCards()
            .subscribe(this.extractDataService.extract(success, err));
    }

    onCreate(data: any) {
        let success = () => {
            this.onList();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.create(data)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onTransfer() {

    }


    onViewItem(item: any) {
        console.log("Bó visualizar :D");
        console.log(item);
    }

    onDownloadFile(event: MouseEvent) {
        event.stopPropagation();

        console.log("Baixar o arquivo");
    }

    onCheck(event: MouseEvent) {
        event.stopPropagation();

        console.log("Nice, você pagou a conta!");
    }
}
