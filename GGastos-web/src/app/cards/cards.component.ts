import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExtractDataService } from '../extract-data.service';
import { CardDialogComponent } from '../dialog/card-dialog/card-dialog.component';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

    onEditEcreen: boolean = false;

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

    constructor(
        private dialog: MatDialog,
        private extractDataService: ExtractDataService
    ) { }

    ngOnInit(): void {
    }

    onAddCard(card: any) {
        let dialogRef = this.dialog.open(CardDialogComponent, {
            data: { title: "Nova conta", data: card }
        });

    }

    onList() {
        this.onEditEcreen = false;
    }
    
    onEdit(numero: string) {
        this.onEditEcreen = true;

        console.log(numero);
    }
}
