import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from '../categories/categories.service';
import { ReleasesService } from '../releases/releases.service';
import { AccountsService } from '../accounts/accounts.service';
import { RecurrencesTypesService } from '../recurrences-types/categories.service';

@Component({
    selector: 'app-releases-upload',
    templateUrl: './releases-upload.component.html',
    styleUrls: ['./releases-upload.component.css']
})
export class ReleasesUploadComponent implements OnInit {

    @ViewChild('inputMes') inputMes!: ElementRef;

    modeloDados: any = [];

    dataSource: any = [];

    totalReceita: number = 0;
    totalDespesa: number = 0;

    expenseCategories: any = [];
    incomeCategories: any = [];

    transacoes = [];

    filtros: any[] = [];
    filtroSelecionado: any | null = null;

    constructor(
        private dialog: MatDialog,
        private extractDataService: ExtractDataService,
        private categoriesService: CategoriesService,
        private releasesService: ReleasesService,
        private accountsService: AccountsService,
        private recurrencesTypesService: RecurrencesTypesService,
    ) { }

    ngOnInit(): void {
        this.findIncomeCategory();
        this.findExpensesCategory();

        this.filtros = this.gerarFiltros(this.transacoes);
    }



    gerarFiltros(dados: any[]): any[] {
        const mapa = new Map<string, any>();

        for (const item of dados) {
            const data = new Date(item.data);
            const mes = data.getMonth();
            const ano = data.getFullYear();
            const key = `${mes}-${ano}`;

            if (!mapa.has(key)) {
                mapa.set(key, {
                    mes,
                    ano,
                    label: data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                    total: 1
                });
            } else {
                mapa.get(key)!.total += 1;
            }
        }

        return Array.from(mapa.values()).sort((a, b) => {
            const dataA = new Date(a.ano, a.mes);
            const dataB = new Date(b.ano, b.mes);
            return dataB.getTime() - dataA.getTime();
        });
    }

    selecionarFiltro(filtro: any) {
        this.filtroSelecionado = filtro;

        this.dataSource = filtro;

        let list = [];

        let gastos = [];
        let beforeDay;
        for (let item of filtro.transacoes) {
            let day = new Date(item.data).getDate();

            let gasto = {
                cor: "#cacaca",
                icone: "image",
                description: item.descricao,
                valor: item.valor
            };

            if (day != beforeDay && beforeDay) {
                list.push({
                    date: beforeDay,
                    gastos: gastos
                });
                gastos = [];
                gastos.push(gasto);
            } else {
                gastos.push(gasto);
            }

            beforeDay = day;
        }
        this.dataSource = list;
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


    pegarMesAtual(): string {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
        return `${ano}-${mes}`;
    }


    onCheck(event: MouseEvent, transaction: any) {

    }

    handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;

        if (!input.files?.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            const linhas = text.split('\n').filter(l => l.trim() !== '');

            linhas.shift();

            const transacoes: any[] = linhas.map((linha) => {
                const [dataStr, valorStr, identificador, desc] = linha.split(',').map(s => s.trim());
                const [dia, mes, ano] = dataStr.split('/').map(n => parseInt(n, 10));

                let descricao = desc.split(' - ')[0];
                if (desc.split(' - ')[1]) {
                    descricao += " - " + desc.split(' - ')[1];
                }
                return {
                    data: new Date(ano, mes - 1, dia),
                    valor: parseFloat(valorStr),
                    identificador,
                    descricao
                };
            });

            this.organizarPorMes(transacoes);
        };

        reader.readAsText(file);
    }

    organizarPorMes(transacoes: any[]) {
        const mapa = new Map<string, any>();

        for (const t of transacoes) {
            const mes = t.data.getMonth();
            const ano = t.data.getFullYear();
            const key = `${mes}-${ano}`;

            if (!mapa.has(key)) {
                mapa.set(key, {
                    mes,
                    ano,
                    label: t.data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                    total: 1,
                    transacoes: [t]
                });
            } else {
                const filtro = mapa.get(key)!;
                filtro.total += 1;
                filtro.transacoes.push(t);
            }
        }

        this.filtros = Array.from(mapa.values()).sort((a, b) => {
            const dataA = new Date(a.ano, a.mes);
            const dataB = new Date(b.ano, b.mes);
            return dataB.getTime() - dataA.getTime();
        });

        console.log('Filtros gerados:', this.filtros);
    }

    salvar() {
        console.log('Salvar');
    }

}