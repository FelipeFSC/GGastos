import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    displayedColumns: any[] = [
        { name: 'despesa', style: {'width': '100px', 'border-right': '1px solid #d5d5d5', 'text-align': 'left'}},
        { name: 'janeiro', style: {'width': '80px'} },
        { name: 'fevereiro', style: {'width': '80px'} },
        { name: 'março', style: {'width': '80px'} },
        { name: 'abril', style: {'width': '80px'} },
        { name: 'maio', style: {'width': '80px'} },
        { name: 'junho', style: {'width': '80px'} },
        { name: 'julho', style: {'width': '80px'} },
        { name: 'agosto', style: {'width': '80px'} },
        { name: 'setembro', style: {'width': '80px'} },
        { name: 'outubro', style: {'width': '80px'} },
        { name: 'novembro', style: {'width': '80px'} },
        { name: 'dezembro', style: {'width': '80px'} }
    ];

    columnsToDisplay: string[] = [];

    dataSource: any[] = [
        {
            despesa: 'Agua',
            janeiro: '50,0',
            fevereiro: '49,0',
            março: '70,0',
            abril: '57,0',
            maio: '90,0',
            junho: '0,0',
            julho: '0,0',
            agosto: '41,0',
            setembro: '24,0',
            outubro: '73,0',
            novembro: '4,0',
            dezembro: '22,0'
        },
        {
            despesa: 'Luz',
            janeiro: '500,0',
            fevereiro: '490,0',
            março: '700,0',
            abril: '570,0',
            maio: '900,0',
            junho: '0,0',
            julho: '0,0',
            agosto: '401,0',
            setembro: '240,0',
            outubro: '730,0',
            novembro: '40,0',
            dezembro: '220,0'
        },
        {
            despesa: 'Total',
            janeiro: '500,0',
            fevereiro: '490,0',
            março: '700,0',
            abril: '570,0',
            maio: '900,0',
            junho: '0,0',
            julho: '0,0',
            agosto: '401,0',
            setembro: '240,0',
            outubro: '730,0',
            novembro: '40,0',
            dezembro: '220,0'
        }
    ];

    constructor() { }

    ngOnInit(): void {

        this.columnsToDisplay = this.displayedColumns.map((def) => {
            return def.name;
        });
    }

}
