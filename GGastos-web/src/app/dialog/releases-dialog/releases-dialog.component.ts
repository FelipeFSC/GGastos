import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-releases-dialog',
    templateUrl: './releases-dialog.component.html',
    styleUrls: ['./releases-dialog.component.css']
})
export class ReleasesDialogComponent implements OnInit {

    pokemonGroups: any[] = [
        {
            name: 'Contas',
            pokemon: [
                {value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
                {value: 'oddish-1', viewValue: 'Oddish'},
                {value: 'bellsprout-2', viewValue: 'Bellsprout'},
            ],
        },
        {
            name: 'Cartões',
            pokemon: [
                {value: 'squirtle-3', viewValue: 'Squirtle'},
                {value: 'psyduck-4', viewValue: 'Psyduck'},
                {value: 'horsea-5', viewValue: 'Horsea'},
            ],
        },
    ];

    foods: any[] = [
        {value: 'steak-0', viewValue: 'Steak'},
        {value: 'pizza-1', viewValue: 'Pizza'},
        {value: 'tacos-2', viewValue: 'Tacos'},
    ];

    constructor() { }

    ngOnInit(): void {
    }

}
