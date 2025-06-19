import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReportsService } from '../reports.service';
import { ExtractDataService } from 'src/app/extract-data.service';

@Component({
    selector: 'app-input-output-report',
    templateUrl: './input-output-report.component.html',
    styleUrls: ['./input-output-report.component.css']
})
export class InputOutputReportComponent implements OnInit {

    @Output() isLoaded = new EventEmitter<boolean>();

    isLoad: boolean = true;

    option: any = {};

    data: any = [];

    constructor(
        private extractDataService: ExtractDataService,
        private reportService: ReportsService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();
            this.isLoad = false;

            this.getData();
        }, 1000);
    }

    gerarTodosOsMeses(ano: number): string[] {
        return Array.from({ length: 12 }, (_, i) => {
            const mes = (i + 1).toString().padStart(2, '0');
            return `${ano}-${mes}`;
        });
    }


    getData() {
        const year = 2025;

        let success = (data: any) => {
            const listMap = new Map<string, any>();
            for (let item of data) {
                let object = listMap.get(item.month) || {
                    period: item.month,
                    input: 0,
                    output: 0,
                    balance: 0
                }

                if (item.type === 'entrada') {
                    object.input = item.total;
                } else if (item.type === 'saida') {
                    object.output = item.total;
                }
                object.balance = object.input + object.output;

                listMap.set(item.month, object);
            }

            let meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            for (let item of meses) {
                let month = `${year}-${item}`;
                if (!listMap.has(month)) {
                    listMap.set(month, {
                        period: month,
                        input: 0,
                        output: 0,
                        balance: 0
                    });
                }
            }

            this.data = Array.from(listMap.values()).sort((a, b) => a.period.localeCompare(b.period));

            const entradas = this.data.map((item: any) => item.input);
            const saidas = this.data.map((item: any) => Math.abs(item.output));

            console.log(entradas);
            console.log(saidas);

            this.option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                color: [
                    '#129e3f',
                    '#d72638',
                    '#69bdff',
                ],
                toolbox: {
                    feature: {
                        dataView: { show: false, readOnly: false },
                        magicType: { show: false, type: ['line', 'bar'] },
                        restore: { show: false },
                        saveAsImage: { show: false }
                    }
                },
                legend: {
                    data: ['receitas', 'despesas', 'salvo']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        scale: true
                    },
                    {
                        type: 'value',
                        name: '',
                        scale: true

                    }
                ],
                series: [
                    {
                        name: 'receitas',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value: any) {
                                return value as number + ' R$';
                            }
                        },
                        data: entradas
                    },
                    {
                        name: 'despesas',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value: any) {
                                return value as number + ' R$';
                            }
                        },
                        data: saidas
                    },
                ]
            };
        }

        let error = (error: any) => {
        }

        this.reportService.findMonthlyTotalsByYear(year)
            .subscribe(this.extractDataService.extract(success, error));
    }

}
