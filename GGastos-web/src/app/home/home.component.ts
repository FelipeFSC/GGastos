import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { ReportsService } from '../reports/reports.service';
import { ReleasesService } from '../releases/releases.service';
import { SpendingLimitService } from '../spending-limit/spending-limit.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    balance: number = 0;

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
                    { value: 300, name: 'Casa' },
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

    spendingLimits: any = [];

    constructor(
        private accountsService: AccountsService,
        private extractDataService: ExtractDataService,
        private releasesService: ReleasesService,
        private reportService: ReportsService,
        private spendingLimitService: SpendingLimitService
    ) { }

    valorAnimado: number = 0;

    ngOnInit(): void {
        this.getGeneralBalance();
        this.getCategoryGrafData();
        this.getAccounts();

        this.getDelayedTransactions();
        this.getSpendingLimits();
    }


    animateNumberSmooth(start: number, end: number, duration: number, callback: (val: number) => void) {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = start + (end - start) * progress;

            callback(Math.round(value * 100) / 100);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }


    animateNumberSmoothColor(start: number, end: number, duration: number, callback: (val: number, color: string) => void) {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = start + (end - start) * progress;

            const color = this.getClasseProgresso(value);

            callback(Math.round(value), color);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }


    updateSpendingLimit(categoryId: number) {
        let success = (result: any) => {
            const updatedData = result.find((r: any) => r.category.id === categoryId);

            let percentValue: number = ((updatedData.spent / updatedData.spentLimit) * 100);

            for (let i = 0; i < this.spendingLimits.length; i++) {
                if (this.spendingLimits[i].categoryId === categoryId) {
                    let chart = {
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
                                    updatedData.category.color,
                                    '#eaeded',
                                ],
                                data: [
                                    { value: percentValue, name: 'meta' },
                                    { value: (100 - percentValue), name: 'gasto' },
                                ]
                            }
                        ]
                    };
                    let statusColor = this.getClasseProgresso(percentValue);

                    this.spendingLimits[i].chart = chart;
                    this.spendingLimits[i].statusColor = statusColor;
                    this.spendingLimits[i].spent = updatedData.spent;
                    this.spendingLimits[i].percentValue = percentValue.toFixed(0);
                    this.spendingLimits[i].limit = updatedData.spentLimit;

                    this.animateNumberSmoothColor(this.spendingLimits[i].animatedPercent, Number(this.spendingLimits[i].percentValue), 1000, (val, color) => {
                        this.spendingLimits[i].animatedPercent = val;
                        this.spendingLimits[i].statusColor = color;
                    });
                }
            }
        }

        let err = (error: any) => {
        }

        this.spendingLimitService.findCurrentMonth()
            .subscribe(this.extractDataService.extract(success, err));
    }

    getSpendingLimits() {
        let success = (result: any) => {
            let list = [];

            for (let item of result) {
                let percentValue: number = ((item.spent / item.spentLimit) * 100);
                let chart = {
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
                                item.category.color,
                                '#eaeded',
                            ],
                            data: [
                                { value: percentValue, name: 'meta' },
                                { value: (100 - percentValue), name: 'gasto' },
                            ]
                        }
                    ]
                };

                let statusColor = this.getClasseProgresso(percentValue);
                let data = {
                    id: item.id,
                    categoryId: item.category.id,
                    chart: chart,
                    color: item.category.color,
                    statusColor: statusColor,
                    name: item.category.name,
                    spent: item.spent,
                    percentValue: percentValue.toFixed(0),
                    limit: item.spentLimit,
                    animatedPercent: 0,
                }

                list.push(data);
            }
            this.spendingLimits = list;

            this.spendingLimits.forEach((item: any) => {
                this.animateNumberSmoothColor(0, Number(item.percentValue), 1000, (val, color) => {
                    item.animatedPercent = val;
                    item.statusColor = color;
                });
            });
        }

        let err = (error: any) => {
        }

        this.spendingLimitService.findCurrentMonth()
            .subscribe(this.extractDataService.extract(success, err));
    }

    getClasseProgresso(progresso: number) {
        if (progresso > 95) {
            return '#d72638';
        } else if (progresso > 75) {
            return '#f59638';
        }
        return '#129e3f';
    }


    getDelayedTransactions() {
        let success = (result: any) => {
            let list = [];

            for (let item of result) {
                let categoryId = item.category == null ? item.subCategory.category.id : item.category.id;
                let account = item.account ? item.account.name : "";
                let color = item.category ? item.category.color : item.subCategory.category.color;
                let data = {
                    id: item.id,
                    color: color,
                    account: account,
                    date: new Date(item.transactionDate).toLocaleDateString('pt-BR'),
                    description: item.description,
                    categoryId: categoryId,
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

    onCheck(transaction: any) {
        let success = () => {
            this.getDelayedTransactions();

            this.getCategoryGrafData();
            this.updateSpendingLimit(transaction.categoryId);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.releasesService.isPaid(transaction.id)
            .subscribe(this.extractDataService.extract(success, err));
    }

    getGeneralBalance() {
        let success = (result: any) => {
            this.animateNumberSmooth(0, result, 1000, val => {
                this.balance = val;
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
