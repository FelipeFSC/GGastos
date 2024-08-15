import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

    isLoad: boolean = true;

    typeList: string = "";

    constructor() { }

    ngOnInit(): void {
        this.typeList = "categories";
    }

    onTabChange(event: MatTabChangeEvent) {
        if (!this.isLoad) {
            this.changeLoad();
        }

        switch(event.index) {
            case 0:
                this.typeList = "categories";
                break;
            case 1:
                this.typeList = "inputsOutputs";
                break;
            case 2:
                this.typeList = "accounts";
                break;
            default:
                console.log("error");
                this.typeList = "categories";
        }
    }

    changeLoad() {
        this.isLoad = !this.isLoad;
    }
}
