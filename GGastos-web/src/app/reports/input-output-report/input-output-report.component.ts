import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-input-output-report',
    templateUrl: './input-output-report.component.html',
    styleUrls: ['./input-output-report.component.css']
})
export class InputOutputReportComponent implements OnInit {

    @Output() isLoaded = new EventEmitter<boolean>();

    isLoad: boolean = true;

    option: any = {
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
                data: [
                    10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000
                ]
            },
            {
                name: 'despesas',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value: any) {
                        return value as number + ' R$';
                    }
                },
                data: [
                    3000, 8000, 8000, 8000, 11000, 8000, 8000, 8000, 8000, 8000, 8000, 8000
                ]
            },
/*
            {
                name: 'salvo',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value: any) {
                        return value as number + ' R$';
                    }
                },
                data: [3000, 2000, 2000, -2000, -1000, 2000, 2000, 2000, 2000, 2000, 2000, 2000]
            }
                */
        ]
    };


    data: any = [
        {
            date: "ago de 2024",
            entrada: "0,00",
            saida: "0,00",
            resultado: "0,00",
            saldo: "0,00",
        },
        {
            date: "set de 2024",
            entrada: "1.000,00",
            saida: "-500,00",
            resultado: "500,00",
            saldo: "500,00",
        },
        {
            date: "out de 2024",
            entrada: "0,00",
            saida: "0,00",
            resultado: "0,00",
            saldo: "500,00",
        },
        {
            date: "nov de 2024",
            entrada: "0,00",
            saida: "-10,00",
            resultado: "-10,00",
            saldo: "490,00",
        },
    ];

    constructor() { }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();
            this.isLoad = false;
            console.log('INPUT REPORT');
        }, 1000);
    }

}
