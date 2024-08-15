import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-account-report',
    templateUrl: './account-report.component.html',
    styleUrls: ['./account-report.component.css']
})
export class AccountReportComponent implements OnInit {

    @Output() isLoaded = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();

            console.log('ACCOUNT REPORT');
        }, 3000);
    }

}
