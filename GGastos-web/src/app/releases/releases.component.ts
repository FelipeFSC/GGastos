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

    paymentMethodFilter: string | null = null;

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

    findAllAccountsAndCreditCards() {
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

                let category = { icon: "", color: "" };
                if (item.category) {
                    category = item.category;
                } else {
                    category = item.subCategory.category;
                }

                let parcelaLabel = "";
                if (item.installmentTotal && item.installmentNumber) {
                    parcelaLabel = `${item.installmentNumber}/${item.installmentTotal}`;
                }

                const isCredit = item.creditCard && item.creditCard.id;

                let gasto = {
                    id: item.id,
                    isFixo: item.fixedTransactionId != null || item.installmentGroupId != null,
                    icone: category.icon,
                    cor: category.color,
                    paidDate: item.paidDate,
                    nameCategoria: item.description + (parcelaLabel ? ` (${parcelaLabel})` : "") + (isCredit ? " [Cartão]" : ""),
                    tipoConta: isCredit ? item.creditCard.name : item.account.name,
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

        this.releasesService.findByDate(date, this.paymentMethodFilter)
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
            const formData = new FormData();
            formData.append('file', result.selectedFile);

            result.value = result.value * -1;
            result.transactionType = { id: 2 };
            formData.append('data', JSON.stringify(result));

            if (result.installmentTotal && result.installmentTotal > 1) {
                this.onCreate(formData);
            } else if (result.recurrenceType && result.recurrenceType.id) {
                this.onCreateFixed(result);
            } else {
                this.onCreate(formData);
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

            result.transactionType = { id: 1 };
            result.selectedFile = null;
            formData.append('data', JSON.stringify(result));

            if (result.installmentTotal && result.installmentTotal > 1) {
                this.onCreate(formData);
            } else if (result.recurrenceType && result.recurrenceType.id) {
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
        console.log(item);
        let success = (data: any) => {
            let categories = [];

            if (data.transactionType.id == 1) {
                categories = this.incomeCategories;
            } else {
                categories = this.expenseCategories;
            }

            let dialogRef = this.dialog.open(ReleasesDialogComponent, {
                data: {
                    title: "Edição",
                    recurrencesTypes: this.recurrencesTypes,
                    accounts: this.accounts,
                    categories: categories,
                    editData: data,
                    currentDate: item.transactionDate
                }
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (!result) {
                    return;
                }

                if (data.transactionType.id == 1) {
                    result.transactionType = { id: 1 };
                } else {
                    result.value = result.value * -1;
                    result.transactionType = { id: 2 };
                }

                let groupId = data.installmentGroupId || data.fixedTransactionId || item.fixedTransactionId;

                groupId = groupId ? groupId : 0;
                result.id = data.id;

                if (data.fixedTransactionId && !data.installmentGroupId) {
                    result.fixedTransactionId = data.fixedTransactionId;
                } else {
                    delete result.fixedTransactionId;
                }

                if (data.installmentGroupId) {
                    result.installmentGroupId = data.installmentGroupId;
                } else {
                    delete result.installmentGroupId;
                }


                console.log(result.updateType);
                if (isNaN(result.value)) {
                    this.onDelete(result, groupId, result.updateType, item);

                } else {
                    this.onUpdate(result, groupId, result.updateType, item);
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

    onDelete(data: any, fixedId: number, updateType: string, transaction: any) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        transaction.id = transaction.id ? transaction.id : 0;
        const transactionDate = (transaction.obj && transaction.obj.transactionDate) ? transaction.obj.transactionDate : transaction.transactionDate;
       
        switch (updateType) {
            case "1":
                this.releasesService.delete(transaction.id)
                    .subscribe(this.extractDataService.extract(success, err));

                break;
            case "2":

                this.releasesService.deleteCurrentOthers(transaction.id, fixedId, transactionDate)
                    .subscribe(this.extractDataService.extract(success, err));

                break;
            case "3":

                this.releasesService.deleteAllItens(transaction.id, fixedId)
                    .subscribe(this.extractDataService.extract(success, err));

        }
    }

    onUpdate(data: any, fixedId: number, updateType: string, transaction: any) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        transaction.id = transaction.id ? transaction.id : 0;
        const transactionDate = (transaction.obj && transaction.obj.transactionDate) ? transaction.obj.transactionDate : transaction.transactionDate;
        switch (updateType) {
            case "1":
                if (transaction.id) {
                    this.releasesService.update(data, transaction.id)
                        .subscribe(this.extractDataService.extract(success, err));
                } else {
                    const formData = new FormData();

                    data.fixedTransactionId = fixedId;
                    formData.append('file', "");
                    formData.append('data', JSON.stringify(data));

                    this.releasesService.create(formData)
                        .subscribe(this.extractDataService.extract(success, err));
                }
                break;
            case "2":
                if (!transaction.id) {
                    transaction.id = 0;
                }
                transaction.fixedTransactionId = fixedId;
                this.releasesService.updateCurrentOthers(data, transaction.id, fixedId, transactionDate)
                    .subscribe(this.extractDataService.extract(success, err));
                break;
            case "3":
                if (!transaction.id) {
                    transaction.id = 0;
                }
                this.releasesService.updateAllItens(data, transaction.id, fixedId, transactionDate)
                    .subscribe(this.extractDataService.extract(success, err));
                break;
        }
    }

    onUpdateFixed(data: any, id: number, updateTypeId: string) {
        let success = () => {
            this.filtrarPorMesAno(this.mesAnoSelecionado);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.updateFixed(data, id, updateTypeId)
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
