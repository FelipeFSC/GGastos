import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-releases-dialog',
    templateUrl: './releases-dialog.component.html',
    styleUrls: ['./releases-dialog.component.css']
})
export class ReleasesDialogComponent implements OnInit {

    divideType: string = "";

    isRepeatActive:boolean = false;

    isChatActive:boolean = false;

    isAttachmentActive: boolean = false;

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

    categorySelected: any = {};

    constructor() { }

    ngOnInit(): void {
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

}
