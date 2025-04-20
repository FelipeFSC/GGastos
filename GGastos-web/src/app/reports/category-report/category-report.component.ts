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

    getData2(){
        let success = (data: any) => {
            // console.log(data);

            let list = [];

            const formatador = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            let total = 0
            for (let item of data) {
                if (item.value < 0) {
                    total += item.value;
                }
            }
            this.total = total * -1;

            let beforeItem = null;
            let totalPorCategoria = 0
            let saidas = [];

            for (let item of data) {
                // console.log("x");
                if (item.value < 0) {


                    if (beforeItem != null && item.category.id != beforeItem.category.id) {
                        let category = {
                            nome: beforeItem.category.name,
                            icone: beforeItem.category.icon,
                            cor: beforeItem.category.color,
                            data: ((totalPorCategoria / total) * 100).toFixed(0) + "%",
                            valor: (totalPorCategoria * -1),
                            aberto: false,
                            existeSaida: true,
                            subCategorias: [],
                            saidas: saidas,
                            showSub: []
                        }
                        list.push(category);

                        totalPorCategoria = item.value;
                        saidas = [];
                        saidas.push({
                            nome: item.description,
                            data: formatador.format(new Date(item.paidDate)),
                            valor: (item.value * -1)
                        });
                    } else {
                        saidas.push({
                            nome: item.description,
                            data: formatador.format(new Date(item.paidDate)),
                            valor: (item.value * -1)
                        });
                        totalPorCategoria += item.value;
                    }

                    beforeItem = item;
                    //list.push(category);
                }
            }
            let category = {
                nome: beforeItem.category.name,
                icone: beforeItem.category.icon,
                cor: beforeItem.category.color,
                data: ((totalPorCategoria / total) * 100).toFixed(0) + "%",
                valor: (totalPorCategoria * -1),
                aberto: false,
                existeSaida: true,
                subCategorias: [],
                saidas: saidas,
                showSub: []
            }
            list.push(category);


            this.data = list;
        }

        let error = (error: any) => {
        }

        this.releasesService.findAll()
            .subscribe(this.extractDataService.extract(success, error));
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

    tiraSoSaidas(value: any) {
        console.log("QUASE SUB");
        console.log(value);

        value.saidas = [];
    }

}
