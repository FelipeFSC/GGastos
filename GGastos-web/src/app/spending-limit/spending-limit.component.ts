import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpendingLimitDialogComponent } from '../dialog/spending-limit-dialog/spending-limit-dialog.component';
import { CategoriesService } from '../categories/categories.service';
import { ExtractDataService } from '../extract-data.service';
import { SpendingLimitService } from './spending-limit.service';

@Component({
    selector: 'app-spending-limit',
    templateUrl: './spending-limit.component.html',
    styleUrls: ['./spending-limit.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class SpendingLimitComponent implements OnInit {

    @ViewChild('inputMes') inputMes!: ElementRef;

    mesAnoSelecionado: string = this.pegarMesAtual();

    geralGasto = 1100;
    geralOrcamento = 1550;
    geralProgresso = 71;

    categorias: any = [];

    expenseCategories: any = [];

    constructor(
        private dialog: MatDialog,
        private categoriesService: CategoriesService,
        private extractDataService: ExtractDataService,
        private spendingLimitService: SpendingLimitService
    ) { }

    ngOnInit(): void {
        this.findExpensesCategory();
        this.findAll();
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
        // this.onList(valor);
    }


    getClasseProgresso(progresso: number) {
        if (progresso > 95) {
            return 'cor-vermelha';
        } else if (progresso > 75) {
            return 'cor-amarela';
        }
        return 'cor-verde';
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


    onSave() {
        let dialogRef = this.dialog.open(SpendingLimitDialogComponent, {
            width: '400px',
            data: {
                categories: this.expenseCategories
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                result.filterDate = `${this.mesAnoSelecionado}-01T00:00:00`;
                this.onCreate(result);
            }
        });
    }

    onCreate(data: any) {
        let success = (accountsCreditCards: any) => {
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.spendingLimitService.create(data)
            .subscribe(this.extractDataService.extract(success, err));
    }


    findAll() {
        let success = (data: any) => {
            console.log(data);
            let list = [];
            let totalSpend = 0;
            let totalSpendLimit = 0;

            for (let item of data) {
                totalSpend += item.spent;
                totalSpendLimit += item.spentLimit;

                let category = {
                    id: item.id,
                    title: item.category.name,
                    icon: item.category.icon,
                    color: item.category.color,
                    percentValue: ((item.spent / item.spentLimit) * 100),
                    spent: item.spent,
                    limit: item.spentLimit
                }
                list.push(category);
            }
            this.geralGasto = totalSpend;
            this.geralOrcamento = totalSpendLimit;
            this.geralProgresso = ((totalSpend / totalSpendLimit) * 100);

            this.categorias = list;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.spendingLimitService.findAll()
            .subscribe(this.extractDataService.extract(success, err));
    }

    onEdit(item: any) {
        console.log(item);
    }
}
