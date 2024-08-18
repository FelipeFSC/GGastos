import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-releases-dialog',
    templateUrl: './releases-dialog.component.html',
    styleUrls: ['./releases-dialog.component.css']
})
export class ReleasesDialogComponent implements OnInit {

    tittle: string = "";

    divideType: string = "";

    isRepeatActive:boolean = false;

    isChatActive:boolean = false;

    isAttachmentActive: boolean = false;

    value: string = "R$";

    valorParcela: number|null = null;

    installmentValue: string = "0.00";


    category = "FUNCIONOU";

    pokemonGroups: any[] = [
        {
            name: 'Contas',
            pokemon: [
                {name: 'bulbasaur-0', viewValue: 'Bulbasaur'},
                {name: 'oddish-1', viewValue: 'Oddish'},
                {name: 'bellsprout-2', viewValue: 'Bellsprout'},
            ],
        },
        {
            name: 'Cartões',
            pokemon: [
                {name: 'squirtle-3', viewValue: 'Squirtle'},
                {name: 'psyduck-4', viewValue: 'Psyduck'},
                {name: 'horsea-5', viewValue: 'Horsea'},
            ],
        },
    ];

    foods: any[] = [
        {name: 'steak-0', viewValue: 'Steak'},
        {name: 'pizza-1', viewValue: 'Pizza'},
        {name: 'tacos-2', viewValue: 'Tacos'},
    ];

    paymentRange: any[] = [
        {name: 'Anual'},
        {name: 'Semestral'},
        {name: 'Trimestral'},
        {name: 'Bimestral'},
        {name: 'Mensal'},
        {name: 'Quinzenal'},
        {name: 'Semanal'},
        {name: 'Diário'},
    ];


    categorySelected: any = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.tittle = this.data.title;
    }

    onRepeat() {
        this.isRepeatActive = !this.isRepeatActive;
    }

    onChat() {
        this.isChatActive = !this.isChatActive;
    }

    onAttachment() {
        this.isAttachmentActive = !this.isAttachmentActive;
    }

    valorAlterado() {
        let numberValue = 1;

        if (this.value) {
            let value: string = this.value.replace("R$", "");
            value = value.replace(".", "");
            value = value.replace(",", ".");
            numberValue = Number(value);
        }

        if (this.valorParcela) {
            let result = numberValue / this.valorParcela;
            this.installmentValue = result.toFixed(2);
        }
    }

}
