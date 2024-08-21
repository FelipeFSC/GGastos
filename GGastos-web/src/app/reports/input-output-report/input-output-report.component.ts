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
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: ''
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: ''
            }
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
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
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
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: 'salvo',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value: any) {
                return value as number + ' R$';
              }
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 1.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
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
