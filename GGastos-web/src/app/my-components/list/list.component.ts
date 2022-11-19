import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


    @Input() displayedColumns: any[] = [];

    @Input() data: any[] = [];

    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    columnsToDisplay: string[] = [];

    constructor() { }

    ngOnInit(): void {
        if (this.dataSource) {
            this.dataSource.data = this.data;
        }
        this.prepareDispalyColumns();
    }

    prepareDispalyColumns() {
        this.columnsToDisplay = this.displayedColumns.map((def) => {
            if (def.name) {
                return def.name;
            }
            return def;
        });
    }

}
