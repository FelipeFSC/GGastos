import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../accounts/accounts.service';
import { ExtractDataService } from '../extract-data.service';
import { ReportsService } from '../reports/reports.service';
import { ReleasesService } from '../releases/releases.service';
import { SpendingLimitService } from '../spending-limit/spending-limit.service';
import { forkJoin } from 'rxjs';

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

    today: string = "";

    constructor(
        private accountsService: AccountsService,
        private extractDataService: ExtractDataService,
        private releasesService: ReleasesService,
        private reportService: ReportsService,
        private spendingLimitService: SpendingLimitService
    ) { }

    valorAnimado: number = 0;

    ngOnInit(): void {
        const date = new Date();
        const ano = date.getFullYear();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        this.today = `${ano}-${mes}`;

        forkJoin({
            totalBalance: this.accountsService.getGeneralBalance(),
            categoryGraph: this.reportService.getCategoryReportDto(2),
            accounts: this.accountsService.findByEnabled(true),
            delayedTransactions: this.releasesService.findByDate(this.today),
            spendingLimits: this.spendingLimitService.findCurrentMonth(),
        }).subscribe({
            next: (res) => {
                this.getGeneralBalance(res.totalBalance);
                this.getCategoryGrafData(res.categoryGraph);
                this.getAccounts(res.accounts);
                this.getDelayedTransactions(res.delayedTransactions);
                this.getSpendingLimits(res.spendingLimits);
            },
            error: (err) => {
                console.log(err)
            }
        });
    }

    getGeneralBalance(result: any) {
        this.animateNumberSmooth(this.balance, result, 1000, val => {
            this.balance = val;
        });
    }

    getCategoryGrafData(result: any) {
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

    getAccounts(result: any) {
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

    getDelayedTransactions(result: any) {
        let list = [];

        for (let item of result) {
            if (item.paidDate != null) {
                continue;
            }
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
                value: this.formatValue(item.value),
                obj: item
            }
            list.push(data);
        }
        this.delayedTransactions = list;
    }

    getSpendingLimits(result: any) {
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

    onCheck(transaction: any) {
        let success = () => {
            let categoryId = 0;
            if (transaction.category) {
                categoryId = transaction.category.id;
            } else {
                categoryId = transaction.subCategory.category.id;
            }
            this.updateSpendingLimit(categoryId);
            this.updateHome();
        }

        let err = (error: any) => {
            console.log(error);
        }

        if (transaction.id) {
            this.releasesService.isPaid(transaction.id)
                .subscribe(this.extractDataService.extract(success, err));
        } else {
            this.releasesService.create(transaction)
                .subscribe(this.extractDataService.extract(success, err));
        }
    }

    updateHome() {
        forkJoin({
            totalBalance: this.accountsService.getGeneralBalance(),
            categoryGraph: this.reportService.getCategoryReportDto(2),
            delayedTransactions: this.releasesService.findByDate(this.today),
        }).subscribe({
            next: (res) => {
                this.getGeneralBalance(res.totalBalance);
                this.getCategoryGrafData(res.categoryGraph);
                this.getDelayedTransactions(res.delayedTransactions);
            },
            error: (err) => {
                console.log(err)
            }
        });
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

    getClasseProgresso(progresso: number) {
        if (progresso > 95) {
            return '#d72638';
        } else if (progresso > 75) {
            return '#f59638';
        }
        return '#129e3f';
    }

    formatValue(value: number): string {
        return (value).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

}
