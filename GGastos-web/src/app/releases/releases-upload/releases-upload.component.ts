import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from 'src/app/categories/categories.service';
import { ExtractDataService } from 'src/app/extract-data.service';
import { ReleasesService } from '../releases.service';
import { AccountsService } from 'src/app/accounts/accounts.service';
import { RecurrencesTypesService } from 'src/app/recurrences-types/categories.service';

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

    transacoes: any[] = [];

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
                description: item.raw[1],
                valor: item.raw[2],
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

    private parseCsvLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
                continue;
            }

            current += char;
        }

        result.push(current);

        console.log(result);
        return result;
    }

    private parseDateString(value: string): Date {
        const normalized = value.trim();

        const parts = normalized.split(/[\/\-]/).map(p => p.trim());
        if (parts.length === 3) {
            const [p1, p2, p3] = parts;

            if (p1.length === 2 && p2.length === 2 && p3.length === 4) {
                const dia = parseInt(p1, 10);
                const mes = parseInt(p2, 10);
                const ano = parseInt(p3, 10);
                return new Date(ano, mes - 1, dia);
            }

            if (p1.length === 4 && p2.length === 2 && p3.length === 2) {
                const ano = parseInt(p1, 10);
                const mes = parseInt(p2, 10);
                const dia = parseInt(p3, 10);
                return new Date(ano, mes - 1, dia);
            }
        }

        const parsed = Date.parse(normalized);
        return isNaN(parsed) ? new Date() : new Date(parsed);
    }

    private parseValueString(value: string): number {
        if (value == null) {
            return 0;
        }

        let normalized = value.toString().trim();

        normalized = normalized.replace(/[R$€£]/g, '').trim();

        const hasComma = normalized.indexOf(',') >= 0;
        const hasDot = normalized.indexOf('.') >= 0;
        if (hasComma && hasDot) {
            normalized = normalized.replace(/\./g, '');
            normalized = normalized.replace(/,/g, '.');
        } else if (hasComma && !hasDot) {
            normalized = normalized.replace(/,/g, '.');
        }

        const isNegative = /^\(.*\)$/.test(normalized);
        normalized = normalized.replace(/[()]/g, '');

        const parsed = parseFloat(normalized);
        return isNaN(parsed) ? 0 : (isNegative ? -parsed : parsed);
    }

    handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;

        if (!input.files?.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            const linhas = text.split(/\r?\n/).filter(l => l.trim() !== '');
            if (linhas.length === 0) {
                return;
            }

            const headerLine = linhas.shift()!;
            const headers = this.parseCsvLine(headerLine).map(h => h.trim());

            const dateIdx = headers.findIndex(h => /data|date|dt|dia/i.test(h));
            const valueIdx = headers.findIndex(h => /valor|value|amount|total|montante/i.test(h));

            const titleColumns = headers
                .map((h, idx) => ({ name: h, idx }))
                .filter(c => c.idx !== dateIdx && c.idx !== valueIdx);

            this.modeloDados = {
                headers,
                titleColumns,
                rows: [] as any[]
            };

            const transacoes: any[] = linhas.map((linha) => {
                const cells = this.parseCsvLine(linha);

                const rawDate = dateIdx >= 0 ? cells[dateIdx] : cells[0] ?? '';
                const rawValue = valueIdx >= 0 ? cells[valueIdx] : cells[1] ?? '';

                const titles: any = {};
                for (const col of titleColumns) {
                    titles[col.name] = (cells[col.idx] ?? '').trim();
                }

                return {
                    data: this.parseDateString(rawDate),
                    valor: this.parseValueString(rawValue),
                    titles,
                    raw: cells
                };
            });

            (this.modeloDados as any).rows = transacoes;
            this.transacoes = transacoes;

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
    }

    salvar() {
        console.log('Salvar');
    }

}