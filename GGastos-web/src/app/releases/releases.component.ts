import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReleasesDialogComponent } from '../dialog/releases-dialog/releases-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from '../categories/categories.service';
import { ReleasesService } from './releases.service';
import { RecurrencesTypesService } from '../recurrences-types/categories.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-releases',
    templateUrl: './releases.component.html',
    styleUrls: ['./releases.component.css']
})

export class ReleasesComponent implements OnInit {

    @ViewChild('inputMes') inputMes!: ElementRef;

    modeloDados: any = [];

    saldo: number = 0;
    previsto: number = 0;

    mesAnoSelecionado: string = this.pegarMesAtual();

    recurrencesTypes: any = [];
    accounts: any = [];

    expenseCategories: any = [];
    incomeCategories: any = [];

    constructor(
        private accountsService: AccountsService,
        private dialog: MatDialog,
        private extractDataService: ExtractDataService,
        private categoriesService: CategoriesService,
        private releasesService: ReleasesService,
        private recurrencesTypesService: RecurrencesTypesService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.findAllRecurrencesTypes();
        this.findAllAccountsAndCreditCards();

        this.findIncomeCategory();
        this.findExpensesCategory();

        this.filtrarPorMesAno(this.mesAnoSelecionado);
    }

    abrirSeletor() {
        const input = this.inputMes.nativeElement;
        input.style.pointerEvents = 'auto';
        input.focus();
        input.showPicker?.();
        setTimeout(() => input.style.pointerEvents = 'none', 200);
      }

    get dataSelecionadaComoDate(): Date {
        if (!this.mesAnoSelecionado) {
            this.mesAnoSelecionado = this.pegarMesAtual();
        }
        const [ano, mes] = this.mesAnoSelecionado.split('-').map(Number);
        return new Date(ano, mes - 1);
    }

    findAllAccountsAndCreditCards () {
        let success = (accountsCreditCards: any) => {
            this.accounts = accountsCreditCards;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findAllAccountsAndCreditCards()
            .subscribe(this.extractDataService.extract(success, err));
    }

    findIncomeCategory() {
        let success = (categories: any) => {
            this.incomeCategories = categories;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.findByType("receita")
            .subscribe(this.extractDataService.extract(success, err));
    }

    findExpensesCategory() {
        let success = (categories: any) => {
            this.expenseCategories = categories;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.findByType("despesa")
            .subscribe(this.extractDataService.extract(success, err));
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

    /*
    updateBalance(accountId: number) {
        let success = (data: any) => {}

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.updateBalance(accountId)
            .subscribe(this.extractDataService.extract(success, err));
    }
    */

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

            this.saldo = 0;
            this.previsto = 0;

            let gastos = [];
            let beforeDay;
            for (let item of res) {
                let day = new Date(item.transactionDate).getDate();

                if (item.paidDate) {
                    this.saldo += item.value;
                } else {
                    this.previsto -= item.value;
                }

                let category = {icon: "", color: ""};
                if (item.category) {
                    category = item.category;
                } else {
                    category = item.subCategory.category;
                }

                let gasto = {
                    id: item.id,
                    isFixo: item.fixedTransactionId != null,
                    icone: category.icon,
                    cor: category.color,
                    isAnotacao: null,
                    paidDate: item.paidDate,
                    isAnexo: null,
                    nameCategoria: item.description,
                    tipoConta: item.account.name,
                    valor: item.value.toFixed(2),
                    obj: item
                };
                /*
                  isAnexo {id: 12, nome: "nome"}
                */

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

        this.releasesService.findByDate(date)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onExpense() {
        let dialogRef = this.dialog.open(ReleasesDialogComponent, {
            data: {
                title: "Nova despesa",
                recurrencesTypes: this.recurrencesTypes,
                accounts: this.accounts,
                categories: this.expenseCategories
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) {
                return;
            }

            result.value = result.value * -1;
            result.transactionType = {id: 2};

            if (result.recurrenceType.id) {
                this.onCreateFixed(result);
            } else {
                this.onCreate(result);
            }
        });
    }

    onRevenue() {
        let dialogRef = this.dialog.open(ReleasesDialogComponent, {
            data: {
                title: "Nova receita",
                recurrencesTypes: this.recurrencesTypes,
                accounts: this.accounts,
                categories: this.incomeCategories
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) {
                return;
            }
            const formData = new FormData();
            formData.append('file', result.selectedFile);

            result.transactionType = {id: 1};
            result.selectedFile = null;
            formData.append('data', JSON.stringify(result));

            if (result.recurrenceType.id) {
                this.onCreateFixed(result);
            } else {
                this.onCreate(formData);
            }
        });
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

    onEditItem(item: any) {
        let success = (data: any) => {
            let categories = [];

            if (data.transactionType.id == 1) {
                categories = this.incomeCategories;
            } else {
                categories = this.expenseCategories;
            }

            let dialogRef = this.dialog.open(ReleasesDialogComponent, {
                data: {
                    title: "Nova receita",
                    recurrencesTypes: this.recurrencesTypes,
                    accounts: this.accounts,
                    categories: categories,
                    editData: data
                }
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (!result) {
                    return;
                }
                if (data.transactionType.id == 1) {
                    result.transactionType = {id: 1};
                } else {
                    result.value = result.value * -1;
                    result.transactionType = {id: 2};
                }

                if (data.fixedTransactionId) {
                    result.fixedTransactionId = data.fixedTransactionId;
                }

                if (isNaN(result.value)) {
                    if (result.fixedId) {
                        this.onDeleteFixed(result.fixedId);
                    } else {
                        this.onDelete(result.id);
                    }
                } else {
                    if (result.recurrenceType.id) {
                        this.onUpdateFixed(result, data.id);
                    } else {
                        this.onUpdate(result, data.id);
                    }
                }
            });
        }

        let err = (error: any) => {
            console.log(error);
        }

        if (item.id) {
            this.releasesService.findOneTransaction(item.id)
                .subscribe(this.extractDataService.extract(success, err));
        } else {
            this.releasesService.findOneFixeTransaction(item.fixedTransactionId)
                .subscribe(this.extractDataService.extract(success, err));
        }
    }

    onUpdate(data: any, id: number) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.update(data, id)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onDelete(id: number) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.delete(id)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onUpdateFixed(data: any, id: number) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.updateFixed(data, id)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onDeleteFixed(id: number) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.deleteFixed(id)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onDownloadFile(event: MouseEvent) {
        event.stopPropagation();

        console.log("Baixar o arquivo");
    }

    onCheck(event: MouseEvent, transaction: any) {
        event.stopPropagation();

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
            const formData = new FormData();
            formData.append('file', "");
            formData.append('data', JSON.stringify(transaction));

            this.releasesService.create(formData)
                .subscribe(this.extractDataService.extract(success, err));
        }
    }

    onUploads() {
        this.router.navigate(['releases', 'upload']);
    }
}
