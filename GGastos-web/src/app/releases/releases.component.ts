import { Component, OnInit } from '@angular/core';
import { ReleasesDialogComponent } from '../dialog/releases-dialog/releases-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from '../categories/categories.service';
import { ReleasesService } from './releases.service';
import { RecurrencesTypesService } from '../recurrences-types/categories.service';

@Component({
    selector: 'app-releases',
    templateUrl: './releases.component.html',
    styleUrls: ['./releases.component.css']
})

export class ReleasesComponent implements OnInit {

    modeloDados: any = [];

    saldo: number = 0;
    previsto: number = 0;

    mesAnoSelecionado: string = this.pegarMesAtual();

    recurrencesTypes: any = [];

    constructor(
        private accountsService: AccountsService,
        private dialog: MatDialog,
        private extractDataService: ExtractDataService,
        private categoriesService: CategoriesService,
        private releasesService: ReleasesService,
        private recurrencesTypesService: RecurrencesTypesService
    ) { }

    ngOnInit(): void {
        this.findAllRecurrencesTypes();
        this.filtrarPorMesAno(this.mesAnoSelecionado);
    }

    findAllRecurrencesTypes() {
        let success = (data: any) => {
            this.recurrencesTypes = data;
        }

        let err = (error: any) => {
            console.log(error);
        }
    
        this.recurrencesTypesService.findAll()
            .subscribe(this.extractDataService.extract(success, err));
    }

    pegarMesAtual(): string {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
        return `${ano}-${mes}`;
    }

    alterarMes(incremento: number) {
        const [anoStr, mesStr] = this.mesAnoSelecionado.split('-');
        const ano = parseInt(anoStr);
        const mes = parseInt(mesStr);

        const novaData = new Date(ano, mes - 1 + incremento);
        const novoAno = novaData.getFullYear();
        const novoMes = (novaData.getMonth() + 1).toString().padStart(2, '0');

        this.mesAnoSelecionado = `${novoAno}-${novoMes}`;
        this.filtrarPorMesAno(this.mesAnoSelecionado);
    }

    filtrarPorMesAno(valor: string) {
        this.onList(valor);
    }

    onList(date: string) {
        let success = (res: any) => {
            let list: any = [];

            console.log(res);

            this.saldo = 0;
            this.previsto = 0;

            let gastos = [];
            let beforeDay;
            for (let item of res) {
                let day = new Date(item.transactionDate).getDate();

                if (item.transactionType.id === 1) {
                    this.saldo += item.value;
                } else {
                    this.previsto -= item.value;
                }

                let gasto = {
                    id: item.id,
                    icone: item.category.icon,
                    cor: item.category.color,
                    isAnotacao: "Sempre bom",
                    paidDate: item.paidDate,
                    isAnexo: {
                        id: 14,
                        nome: "folha de pagamento.pdf"
                    },
                    nameCategoria: item.description,
                    tipoConta: item.account.name,
                    valor: item.value.toFixed(2),
                    obj: item
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

        this.releasesService.findAll(date)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onExpense() {
        let success = (accountsCreditCards: any) => {

            let success = (categoriesSubCategories: any) => {
                let dialogRef = this.dialog.open(ReleasesDialogComponent, {
                    data: { 
                        title: "Nova despesa",
                        recurrencesTypes: this.recurrencesTypes,
                        accounts: accountsCreditCards,
                        categories: categoriesSubCategories
                    }
                });
        
                dialogRef.afterClosed().subscribe((result: any) => {
                    result.value = result.value * -1;
                    result.transactionType = {id: 2};
                    
                    if (result.recurrenceType.id) {
                        this.onCreateFixed(result);
                    } else {
                        this.onCreate(result);
                    }
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
                        recurrencesTypes: this.recurrencesTypes,
                        accounts: accountsCreditCards,
                        categories: categoriesSubCategories
                    }
                });
        
                dialogRef.afterClosed().subscribe((result: any) => {
                    result.transactionType = {id: 1};

                    if (result.recurrenceType.id) {
                        this.onCreateFixed(result);
                    } else {
                        this.onCreate(result);
                    }
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

    onCreateFixed(data: any) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.createFixed(data)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onCreate(data: any) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
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

    onCheck(event: MouseEvent, transaction: any) {
        event.stopPropagation();

        console.log("Nice, você pagou a conta!");
        console.log(transaction);


        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        if (transaction.id) {
            this.releasesService.isPaid(transaction.id)
                .subscribe(this.extractDataService.extract(success, err));
        } else {
            this.releasesService.create(transaction)
                .subscribe(this.extractDataService.extract(success, err));
        }

    }
}
