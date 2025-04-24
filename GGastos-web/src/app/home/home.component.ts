import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { ReportsService } from '../reports/reports.service';
import { ReleasesService } from '../releases/releases.service';

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

    accounts: any = [];

    delayedTransactions: any = [];

    constructor(
        private accountsService: AccountsService,
        private extractDataService: ExtractDataService,
        private releasesService: ReleasesService,
        private reportService: ReportsService
    ) { }

    ngOnInit(): void {
        this.getGeneralBalance();
        this.getCategoryGrafData();
        this.getAccounts();

        this.getDelayedTransactions();
    }

    getDelayedTransactions() {
        let success = (result: any) => {
            console.log(result);

            let list = [];
            for (let item of result) {
                let account = item.account ? item.account.name : "";
                let color = item.category ? item.category.color : item.subCategory.category.color;
                let data = {
                    id: item.id,
                    color: color,
                    account: account,
                    date: new Date(item.transactionDate).toLocaleDateString('pt-BR'),
                    description: item.description,
                    value: this.formatValue(item.value)
                }
                list.push(data);
            }
            this.delayedTransactions = list;
        }

        let err = (error: any) => {
        }

        this.releasesService.findExpiredUnpaid(2)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onCheck(transactionId: number) {
        let success = () => {
            this.getDelayedTransactions();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.isPaid(transactionId)
            .subscribe(this.extractDataService.extract(success, err));
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

    getAccounts() {
        let success = (result: any) => {
            let lista = [];
            for (let item of result) {
                let data = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color,
                    balance: this.formatValue(item.balance),
                    enabled: item.enabled,
                    main: item.main,
                    user: item.user
                }

                lista.push(data);
            }
            this.accounts = lista;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findByEnabled(true)
            .subscribe(this.extractDataService.extract(success, err));
    }

    formatValue(value: number): string {
        return (value).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
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
