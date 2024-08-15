import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-input-output-report',
    templateUrl: './input-output-report.component.html',
    styleUrls: ['./input-output-report.component.css']
})
export class InputOutputReportComponent implements OnInit {

    @Output() isLoaded = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();

            console.log('INPUT REPORT');
        }, 3000);
    }

}
