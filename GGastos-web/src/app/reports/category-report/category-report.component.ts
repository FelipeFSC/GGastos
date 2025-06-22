import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExtractDataService } from 'src/app/extract-data.service';
import { ReleasesService } from 'src/app/releases/releases.service';
import { ReportsService } from '../reports.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-category-report',
    templateUrl: './category-report.component.html',
    styleUrls: ['./category-report.component.css']
})
export class CategoryReportComponent implements OnInit {

    @Output() isLoaded = new EventEmitter<boolean>();

    isLoad: boolean = true;

    expensesData: any = {};
    incomeData: any = {};

    total: number = 0;
    total2: number = 0;

    data: any = [];
    data2: any = [];

    constructor(
        private extractDataService: ExtractDataService,
        private releasesService: ReleasesService,
        private reportService: ReportsService
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();
            this.isLoad = false;

            forkJoin({
                incomeData: this.reportService.getCategoryReportDto(1).pipe(),
                expensesData: this.reportService.getCategoryReportDto(2).pipe(),
            }).subscribe({
                next: (res) => {
                    this.onSetExpensesData(res.expensesData);
                    this.onSetIncomeData(res.incomeData);
                },
                error: (err) => {
                    console.error('Erro nas requisições', err);
                }
            });

            this.getData2();
        }, 1000);
    }

    getData2() {
        let success = (data: any) => {
            let list: any = [];
            let listEntrada: any = [];

            for (let item of data) {
                if (item.value < 0) {
                    list.push(item);
                } else {
                    listEntrada.push(item);
                }
            }

            this.data = this.organizarTransacoes(list);
            this.data2 = this.organizarTransacoes(listEntrada);

            let total = 0;
            for (let item of this.data) {
                total += item.valor;
            }
            this.total = total;
            total = 0;
            for (let item of this.data2) {
                total += item.valor;
            }
            this.total2 = total;
        }

        let error = (error: any) => {
        }

        this.releasesService.findPaidTransactionsInPeriod()
            .subscribe(this.extractDataService.extract(success, error));
    }


    organizarTransacoes(transacoes: any[]) {
        const categoriasMap = new Map<number, any>();

        // Primeiro, processa as transações para organizar as categorias e subcategorias
        transacoes.forEach(tx => {

            const categoria = tx.category || tx.subCategory?.category;
            const subCategoria = tx.subCategory;
            if (!categoria) return;

            const catId = categoria.id;

            // Criação da categoria no mapa, caso não exista
            if (!categoriasMap.has(catId)) {
                categoriasMap.set(catId, {
                    nome: categoria.name,
                    icone: categoria.icon,
                    cor: categoria.color,
                    data: '',
                    valor: 0,
                    aberto: false,
                    saidasDiretas: [],
                    subCategorias: new Map<number | string, any>()
                });
            }

            const catObj = categoriasMap.get(catId);

            // Formatação de dados de transação
            const dataFormatada = new Date(tx.transactionDate).toLocaleDateString('pt-BR');
            const valorFormatado = Math.abs(tx.value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const saida = {
                nome: tx.description,
                data: dataFormatada,
                valor: valorFormatado
            };

            // Processa as subcategorias
            if (subCategoria) {
                const subId = subCategoria.id;
                if (!catObj.subCategorias.has(subId)) {
                    catObj.subCategorias.set(subId, {
                        nome: subCategoria.name.trim(),
                        icone: categoria.icon,
                        cor: categoria.color,
                        data: '',
                        valor: 0,
                        aberto: false,
                        saidas: []
                    });
                }

                const subObj = catObj.subCategorias.get(subId);
                subObj.saidas.push(saida);
                subObj.valor += Math.abs(tx.value);

                if (!subObj.data || new Date(tx.transactionDate) > new Date(subObj.data)) {
                    subObj.data = dataFormatada;
                }
            } else {
                // Transação sem subcategoria
                catObj.saidasDiretas.push({
                    ...saida,
                    rawDate: tx.transactionDate // para ordenar depois
                });
            }

            catObj.valor += Math.abs(tx.value);

            if (!catObj.data || new Date(tx.transactionDate) > new Date(catObj.data)) {
                catObj.data = dataFormatada;
            }
        });

        // Agora, finalizando a estrutura com porcentagens
        return Array.from(categoriasMap.values()).map((cat: any) => {
            const categoriaTotal = cat.valor;

            // Verifica se categoriaTotal é um número válido e diferente de zero
            if (isNaN(categoriaTotal) || categoriaTotal === 0) {
                cat.porcentagem = '0%';  // Evita NaN, atribui 0% se o total for inválido
            } else {
                cat.porcentagem = ((categoriaTotal / categoriaTotal) * 100).toFixed(2) + "%";  // Caso categoria seja válida
            }

            // Se tem subCategorias e também saidas diretas, cria subCategoria "implícita"
            if (cat.subCategorias.size > 0 && cat.saidasDiretas.length > 0) {
                const pseudoSub: any = {
                    nome: `${cat.nome}`,
                    icone: cat.icone,
                    cor: cat.cor,
                    data: '',
                    valor: 0,
                    aberto: false,
                    saidas: []
                };

                // Processa as saidas diretas na subcategoria "implícita"
                cat.saidasDiretas.forEach((saida: any) => {
                    pseudoSub.saidas.push({
                        nome: saida.nome,
                        data: saida.data,
                        valor: saida.valor
                    });

                    pseudoSub.valor += parseFloat(saida.valor.replace('.', '').replace(',', '.'));

                    if (!pseudoSub.data || new Date(saida.rawDate) > new Date(pseudoSub.data)) {
                        pseudoSub.data = saida.data;
                    }
                });

                // Formata o valor e calcula a porcentagem da subcategoria
                pseudoSub.porcentagem = ((pseudoSub.valor / categoriaTotal) * 100).toFixed(2) + "%";

                pseudoSub.valor = Math.abs(pseudoSub.valor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                // Coloca no começo com chave especial
                const subMap = new Map<number | string, any>();
                subMap.set('principal', pseudoSub);
                for (const [key, value] of cat.subCategorias.entries()) {
                    // Verifica e calcula a porcentagem de cada subcategoria
                    if (isNaN(value.valor) || value.valor === 0) {
                        value.porcentagem = '0%';  // Evita NaN, atribui 0% se o valor for inválido
                    } else {
                        value.porcentagem = ((value.valor / categoriaTotal) * 100).toFixed(2) + "%";
                    }
                    subMap.set(key, value);
                }
                cat.subCategorias = subMap;
            }

            // Se não tem subCategorias, mantemos as saidas direto
            cat.saidas = cat.subCategorias.size === 0 ? cat.saidasDiretas.map((saida: any) => ({
                nome: saida.nome,
                data: saida.data,
                valor: saida.valor
            })) : [];

            // Remove campo intermediário de saidasDiretas
            delete cat.saidasDiretas;
            cat.subCategorias = Array.from(cat.subCategorias.values());

            return cat;
        });
    }

    onSetExpensesData(data: any) {
        this.expensesData = {
            tooltip: {
                trigger: 'item'
            },

            series: [{
                name: '',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                color: data.colors,
                data: data.data
            }]
        };
    }

    onSetIncomeData(data: any) {
        this.incomeData = {
            tooltip: {
                trigger: 'item'
            },

            series: [{
                name: '',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                color: data.colors,
                data: data.data
            }]
        };
    }


    onAbriEFecha(value: any) {
        value.aberto = !value.aberto;
    }

}
