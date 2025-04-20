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

    /*

    {
        nome: "cas 1",
        data: "03/08/2024",
        valor: "100,00"
    },
    {
        nome: "cas 2",
        data: "03/08/2024",
        valor: "100,00"
    },
    {
        nome: "cas 3",
        data: "03/08/2024",
        valor: "1001111111,00"
    }

    */

    data: any = [
        {
            nome: "Casa",
            icone: "home",
            cor: "red",
            data: "03/08/2024",
            valor: "100,00",
            aberto: false,
            existeSaida: true,
            subCategorias: [],
            saidas: [],
            showSub: [
                {
                    nome: "sub 1 Casa",
                    icone: "home",
                    cor: "red",
                    data: "03/08/2024",
                    valor: "100,00",
                    saidas: [
                        {
                            nome: "sub 1",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "sub 2",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "sub 3",
                            data: "03/08/2024",
                            valor: "100,00"
                        }
                    ],
                },
                {
                    nome: "sub 2 Casa",
                    icone: "home",
                    cor: "red",
                    data: "03/08/2024",
                    valor: "100,00",
                    saidas: [
                        {
                            nome: "sub 1",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "sub 2",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "sub 3",
                            data: "03/08/2024",
                            valor: "100,00"
                        }
                    ],
                }
            ]
        },
        {
            nome: "Comida",
            icone: "home",
            cor: "red",
            data: "03/08/2024",
            valor: "100,00",
            aberto: false,
            saidas: [
                {
                    nome: "com 1",
                    data: "03/08/2024",
                    valor: "100,00"
                },
                {
                    nome: "com 2",
                    data: "03/08/2024",
                    valor: "100,00"
                },
                {
                    nome: "com 3",
                    data: "03/08/2024",
                    valor: "100,00"
                }
            ],
            subCategorias: []
        },
        {
            nome: "Hotelzinho",
            icone: "home",
            cor: "red",
            data: "03/08/2024",
            valor: "100,00",
            aberto: false,
            saidas: [],
            subCategorias: [
                {
                    nome: "sub prima",
                    icone: "home",
                    cor: "red",
                    data: "03/08/2024",
                    valor: "100,00",
                    saidas: [
                        {
                            nome: "prima 1",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "prima 2",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "prima 3",
                            data: "03/08/2024",
                            valor: "100,00"
                        }
                    ],
                },
                {
                    nome: "sub soninho",
                    icone: "home",
                    cor: "red",
                    data: "03/08/2024",
                    valor: "100,00",
                    saidas: [
                        {
                            nome: "mimi 1",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "mimi 2",
                            data: "03/08/2024",
                            valor: "100,00"
                        },
                        {
                            nome: "mimi 3",
                            data: "03/08/2024",
                            valor: "100,00"
                        }
                    ],
                }
            ]
        }
    ]


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

            for (let item of data) {
                if (item.value < 0) {
                    list.push(item);
                }
            }

            this.data = this.organizarTransacoes(list);
        }

        let error = (error: any) => {
        }

        this.releasesService.findAll()
            .subscribe(this.extractDataService.extract(success, error));
    }


    organizarTransacoes(transacoes: any[]) {
        const categoriasMap = new Map<number, any>();
    
        let total = 0;
        // Primeiro, processa as transações para organizar as categorias e subcategorias
        transacoes.forEach(tx => {
            total += Math.abs(tx.value);

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
                /* */
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
    
            // Converte subCategorias Map para array final
            cat.subCategorias = Array.from(cat.subCategorias.values());
    
            // Verifica se categoriaTotal é um número válido
            if (isNaN(categoriaTotal) || categoriaTotal === 0) {
                cat.porcentagem = '0%';  // Evita NaN, atribui 0% se o total for inválido
            } else {
                cat.porcentagem = ((cat.valor / total) * 100).toFixed(2) + "%";
            }
    
            this.total = total;
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
