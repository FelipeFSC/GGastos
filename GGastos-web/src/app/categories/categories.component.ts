import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../dialog/category-dialog/category-dialog.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    items: any = [{id: 1, icone: 'home', color: '#0011ff', name: 'Casa'}];

    constructor(
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    onAddUnitOfMeasure(category?: any) {
        let dialogRef = this.dialog.open(CategoryDialogComponent, {
            width: '400px',
            data: { edit: ((category ? category : null))}
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                if (result.id) {
                    this.items.forEach((item: any) => {
                        if (item.id === result.id) {
                            item.icone = result.icone;
                            item.color = result.color;
                            item.name = result.name;
                        }
                    });

                } else {
                    result.id = Math.floor(Math.random() * 100000000);
                    this.items.push(result);
                }
            }
//            console.log(result);
        });
    }

}
