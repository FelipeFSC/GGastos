import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-category-report',
    templateUrl: './category-report.component.html',
    styleUrls: ['./category-report.component.css']
})
export class CategoryReportComponent implements OnInit {
    
    @Output() isLoaded = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();

            console.log('CATEGORY REPORT');
        }, 3000);
    }

}
