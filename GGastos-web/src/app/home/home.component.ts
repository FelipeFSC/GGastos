import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

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
                    '#fb7293',
                    '#E062AE',
                    '#E690D1',
                    '#e7bcf3',
                    '#9d96f5',
                    '#8378EA',
                    '#96BFFF'
                ],
                data: [
                    { value: 300, name: 'Search Engine'},
                    { value: 300, name: 'Direct' },
                    { value: 300, name: 'Email' },
                    { value: 300, name: 'Union Ads' },
                    { value: 300, name: 'Union Ads1' },
                    { value: 300, name: 'Union Ads2' },

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

    constructor() { }

    ngOnInit(): void {
    }

}
