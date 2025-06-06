import { Component, OnInit } from '@angular/core';
import { ExtractDataService } from '../extract-data.service';
import { InvestmentsService } from './investments.service';

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



    colunasGrafico: string[] = ['tipo', 'dataCom', 'pagamento', 'cotacao', 'valor', 'yield'];
    fundos: any = [];

    colunas: string[] = ['codigo', 'valor', 'dividendYield'];
    altas: any = [];
    baixas: any = [];
    sugeridos: any = [];

    constructor(
        private extractDataService: ExtractDataService,
        private investmentsService: InvestmentsService,
    ) { }

    ngOnInit(): void {
        this.onListResume();
    }


    valor: any = [];
    yield: any = [];

    getFii() {
        let success = (res: any) => {
            let dadosResumo = [];
            let dadosGrafico = [];
            for (let item of res) {
                if (Object.keys(item)[0] === "dadosTratados") {
                    let resumo = {
                        titulo: item.dadosTratados[0],
                        valor: item.dadosTratados[1]
                    }
                    dadosResumo.push(resumo);
                } else if (Object.keys(item)[0] === "myNewField") {
                    let valor = [];
                    let yieldData = [];
                    for (let subItem of item.myNewField.slice(4, 9)) {
                        let data = {
                            tipo: subItem[0],
                            dataCom: subItem[1],
                            pagamento: subItem[2],
                            cotacao: subItem[3],
                            valor: subItem[4],
                            yield: subItem[5]
                        }

                        valor.push(subItem[4]);
                        yieldData.push(subItem[5]);

                        dadosGrafico.push(data);
                    }

                    this.valor = valor;
                    this.yield = yieldData;
                }
            }
            this.fundos = dadosGrafico;
            this.resumo = dadosResumo;

            this.generateGraft();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.investmentsService.getFii(this.filtro)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onListResume() {
        let success = (res: any) => {
            let altas: any = [];
            let baixas: any = [];
            let sugeridos: any = [];

            for (let item of res) {

                if (Object.keys(item)[0] === "tag_alta") {
                    let alta = {
                        codigo: item.tag_alta,
                        valor: item.preco_alta,
                        dividendYield: item.porcent_alta,
                        descricao: item.titulo_alta
                    }
                    altas.push(alta);
                } else if (Object.keys(item)[0] === "tag_baixa") {
                    let baixa = {
                        codigo: item.tag_baixa,
                        valor: item.preco_baixa,
                        dividendYield: item.porcent_baixa,
                        descricao: item.titulo_baixa
                    }
                    baixas.push(baixa);
                } else {
                    let sugerido = {
                        codigo: item.cod_sugerido,
                        valor: item.cotacao_dividendYield[0],
                        dividendYield: item.cotacao_dividendYield[1],
                    }
                    sugeridos.push(sugerido);
                }
            }

            this.altas = altas;
            this.baixas = baixas;
            this.sugeridos = sugeridos;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.investmentsService.getResume()
            .subscribe(this.extractDataService.extract(success, err));
    }



    option: any = {};

    generateGraft() {
        console.log(this.valor);
        console.log(this.yield);

        const valoresNumericos = this.valor.map((v: any) =>
            parseFloat(parseFloat(v.replace('R$', '').replace(',', '.')).toFixed(2))
        );

        const percentuaisNumericos = this.yield.map((p: any) =>
            parseFloat(parseFloat(p.replace('%', '').replace(',', '.')).toFixed(2))
        );

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
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['Dividendos', 'Precipitation', 'Dvidend yield']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
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
                    max: 1.2,
                    interval: 0.2,
                    axisLabel: {
                        formatter: 'R$ {value}'
                    }
                },
                {
                    type: 'value',
                    name: 'Dvidend yield',
                    min: 0,
                    max: 1.2,
                    interval: 0.2,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: 'Dividendos',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: any) {
                            return value;
                        }
                    },
                    data: valoresNumericos
                },
                {
                    name: 'Dvidend yield',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: function (value: any) {
                            return value;
                        }
                    },
                    data: percentuaisNumericos
                }
            ]
        };
    }

}
