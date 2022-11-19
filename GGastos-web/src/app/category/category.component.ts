import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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


    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    onAdd() {
        this.router.navigate(['category', 'register']);
    }

}
