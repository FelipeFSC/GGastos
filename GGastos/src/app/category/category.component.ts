import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

    selected: Date | null | undefined;

    displayedColumns: any[] = [
        { name: "nome"},
    ];

    dataSource: any[] = [
        {
            nome: "Agua"
        },{
            nome: "Luz"
        },{
            nome: "Internet"
        },{
            nome: "Academia"
        },{
            nome: "Putas"
        },{
            nome: "Dentista"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        }
    ];

    dataSource2:  any[] = [
        {
            nome: "Salario Fixo"
        },{
            nome: "Decimo terceiro"
        },{
            nome: "Roubo"
        },{
            nome: "Presente"
        },{
            nome: "Gado"
        },{
            nome: "Fazenda"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        },{
            nome: "teste"
        }
    ];


    constructor() { }

    ngOnInit(): void {
    }

    onAdd() {
    }

}
