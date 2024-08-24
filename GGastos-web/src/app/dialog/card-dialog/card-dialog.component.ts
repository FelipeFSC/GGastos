import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-card-dialog',
    templateUrl: './card-dialog.component.html',
    styleUrls: ['./card-dialog.component.css']
})
export class CardDialogComponent implements OnInit {

    category: any = {id: 0, icon: "home", color: "#0011ff", name: ""};

    days = Array.from({ length: 31 }, (_, index) => index + 1);


    styleColor: any = {'background-color':this.category.color};

    value: string = "R$";

    constructor() { }

    ngOnInit(): void {
    }

    changeColor() {
        this.styleColor = {'background-color':this.category.color};
    }

}
