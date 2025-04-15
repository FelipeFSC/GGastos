import { Component, OnInit } from '@angular/core';
import { ReleasesDialogComponent } from '../dialog/releases-dialog/releases-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from '../categories/categories.service';

@Component({
    selector: 'app-releases',
    templateUrl: './releases.component.html',
    styleUrls: ['./releases.component.css']
})

export class ReleasesComponent implements OnInit {

    modeloDados: any = [];

    constructor(
        private accountsService: AccountsService,
        private dialog: MatDialog,
        private extractDataService: ExtractDataService,
        private categoriesService: CategoriesService,
    ) { }

    ngOnInit(): void {
        this.modeloDados = [
            {   
                data: "01",
                gastos: [
                    {
                        icone: "star",
                        cor: "#74e2aa",
                        isAnotacao: "Sempre bom",
                        isAnexo: {
                            id: 14,
                            nome: "folha de pagamento.pdf"
                        },
                        isFixo: true,


                        nameCategoria: "Salário",
                        tipoConta: "Conta inicial",
                        valor: "1750"
                    },
                    {   
                        icone: "favorite",
                        cor: "#74e2dd",
                        isAnotacao: "Fiz a geral no PC do Jonas, filho do Geraldo da esquina.",
                        isAnexo: null,
                        isFixo: false,

                        nameCategoria: "Bico",
                        tipoConta: "Conta inicial",
                        valor: "500"
                    }
                ]
            },
            {
                data: "05",
                gastos: [
                    {
                        icone: "star",
                        cor: "#74e2aa",
                        isAnotacao: null,
                        isAnexo: null,
                        isFixo: true,

                        nameCategoria: "Salário",
                        tipoConta: "Conta do momozin",
                        valor: "2300"
                    }
                ]
            },
            {
                data: "10",
                gastos: [
                    {
                        icone: "shopping_cart",
                        cor: "#ff9281",
                        isAnotacao: null,
                        isAnexo: null,
                        isFixo: false,

                        nameCategoria: "Feijão",
                        tipoConta: "Conta conjunta",
                        valor: "50"
                    },
                    {
                        icone: "shopping_cart",
                        cor: "#ff9281",
                        isAnotacao: "Ta caro, né!?",
                        isAnexo: null,
                        isFixo: false,

                        nameCategoria: "Arroz",
                        tipoConta: "Conta conjunta",
                        valor: "60"
                    },
                    {
                        icone: "shopping_cart",
                        cor: "#ff9281",
                        isAnotacao: null,
                        isAnexo: null,
                        isFixo: false,

                        nameCategoria: "Saladinha hmm",
                        tipoConta: "Conta conjunta",
                        valor: "40"
                    },
                    {
                        icone: "shopping_cart",
                        cor: "#ff9281",
                        isAnotacao: "SELOKO, só comprei uma unidade de hamburguer",
                        isAnexo: null,
                        isFixo: false,

                        nameCategoria: "Carne",
                        tipoConta: "Conta conjunta",
                        valor: "150"
                    }
                ]
            },
        ];


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
                    console.log(result);
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
        let dialogRef = this.dialog.open(ReleasesDialogComponent, {
            data: { title: "Nova receita" }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            console.log(result);
        });
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
