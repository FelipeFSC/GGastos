import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

    data: any = [
        {
            nome: "Banco 1",
            image: "Foto 1",
        },
        {
            nome: "Banco BCT",
            image: "Foto 1",
        },
        {
            nome: "Nu Bancos",
            image: "Foto 1",
        },
        {
            nome: "Piracantuba Bancos",
            image: "Foto 1",
        },
    ]

    constructor() { }

    ngOnInit(): void {
    }

}
