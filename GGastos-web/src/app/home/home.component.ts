import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { ReportsService } from '../reports/reports.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    balance: string = "";

    option: any = {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['60%', '40%'],
            height: 65,
            left: 0,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            color: [
                '#62cd98',
                '#eaeded',
            ],
            data: [
              { value: 200, name: 'meta' },
              { value: 1800, name: 'gasto' },
            ]
          }
        ]
    };

    options: any = {
        textStyle: {
            fontFamily: "monospace",
            fontSize: 11
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                type: 'pie',
                radius: '50px',
                left: 130,
                bottom: 0,
                height: 150,
                color: [
                    '#37A2DA',
                    '#32C5E9',
                    '#67E0E3',
                    '#9FE6B8',
                    '#FFDB5C',
                    '#ff9f7f',
                ],
                data: [
                    { value: 300, name: 'Casa'},
                    { value: 300, name: 'Transporte' },
                    { value: 300, name: 'Comida' },
                    { value: 300, name: 'Lazer' },
                    { value: 300, name: 'Estudos' },
                    { value: 300, name: 'Jogos' },

                ],
                emphasis: {
                itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    items: any = [{}, {}, {}];

    constructor(
        private accountsService: AccountsService,
        private extractDataService: ExtractDataService,
        private reportService: ReportsService
    ) { }

    ngOnInit(): void {
        this.getGeneralBalance();
        this.getCategoryGrafData();
    }

    getGeneralBalance() {
        let success = (result: any) => {
            this.balance = (result).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.getGeneralBalance()
            .subscribe(this.extractDataService.extract(success, err));
    }

    getCategoryGrafData() {
        let success = (result: any) => {
            this.options = {
                textStyle: {
                    fontFamily: "monospace",
                    fontSize: 11
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50px',
                        left: 130,
                        bottom: 0,
                        height: 150,
                        color: result.colors,
                        data: result.data,
                        emphasis: {
                        itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.reportService.getCategoryReportDto(2)
            .subscribe(this.extractDataService.extract(success, err));
    }

}
