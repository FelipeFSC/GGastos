import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-investments',
    templateUrl: './investments.component.html',
    styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {

    filtro: string = '';

    resumo = [
        { titulo: 'Patrimônio', valor: 'R$ 12.500.000' },
        { titulo: 'Cotas Emitidas', valor: '1.250.000' },
        { titulo: 'Liquidez Diária', valor: 'R$ 1.150.000' },
        { titulo: 'PL por Cota', valor: 'R$ 100,00' },
        { titulo: 'Vacância Física', valor: '8,5%' },
        { titulo: 'Vacância Financeira', valor: '7,2%' },
        { titulo: 'Setor', valor: 'Logística' }
    ];


    dados = [
        { titulo: 'Dividendos Mês', valor: 'R$ 1.250,00' },
        { titulo: 'Rendimento Médio', valor: '0,95%' },
        { titulo: 'Último Rendimento', valor: '0,88%' },
        { titulo: 'Data Base', valor: '30/05/2025' }
    ];




    colunas: string[] = ['nome', 'codigo', 'rentabilidade'];

    melhores = [
        { nome: 'Fundo XP Logística', codigo: 'XPLG11', rentabilidade: 4.2 },
        { nome: 'Fundo BTG Corporate', codigo: 'BRCR11', rentabilidade: 3.8 },
        { nome: 'Fundo HGLG', codigo: 'HGLG11', rentabilidade: 4.5 }
    ];

    piores = [
        { nome: 'Fundo Mall REIT', codigo: 'MALL11', rentabilidade: -1.8 },
        { nome: 'Fundo VBI Logística', codigo: 'LVBI11', rentabilidade: -2.4 },
        { nome: 'Fundo TRX Real Estate', codigo: 'TRXF11', rentabilidade: -1.5 }
    ];


    destaques = [
        { codigo: 'XPLG11', valor: 122.30, variacao: 1.8, dy: 0.85 },
        { codigo: 'HGLG11', valor: 168.75, variacao: 2.1, dy: 0.92 },
        { codigo: 'BRCR11', valor: 97.10, variacao: -0.7, dy: 0.78 },
        { codigo: 'VISC11', valor: 110.00, variacao: 1.2, dy: 0.88 },
        { codigo: 'RBRF11', valor: 95.50, variacao: -1.1, dy: 0.72 }
    ];

    constructor() { }

    ngOnInit(): void {
    }

    melhoresFiltrados() {
        return this.melhores.filter(f =>
            f.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
            f.codigo.toLowerCase().includes(this.filtro.toLowerCase())
        );
    }

    pioresFiltrados() {
        return this.piores.filter(f =>
            f.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
            f.codigo.toLowerCase().includes(this.filtro.toLowerCase())
        );
    }












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
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['Evaporation', 'Precipitation', 'Temperature']
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Precipitation',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: 'Temperature',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name: 'Evaporation',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value: any) {
                        return value as number + ' ml';
                    }
                },
                data: [
                    2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                ]
            },
            {
                name: 'Temperature',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value: any) {
                        return value as number + ' °C';
                    }
                },
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
        ]
    };

}
