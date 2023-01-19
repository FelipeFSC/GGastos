import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../dialog/category-dialog/category-dialog.component';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from './categories.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    items: any = [];

    constructor(
        private dialog: MatDialog,
        private categoriesService: CategoriesService,
        private extractDataService: ExtractDataService
    ) { }

    ngOnInit(): void {
        this.list();
    }

    list() {
        let success = (res: any) => {
            let list: any[] = [];
            for (let item of res) {
                let category = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color,
                    type: item.type,
                    enabled: item.enabled
                }
                list.push(category);
            }
            this.items = list;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.findAll()
            .subscribe(this.extractDataService.extract(success, err));
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

                    console.log(result);

                    let category: any = {
                        id: result.id,
                        type: "Gasto",
                        name: result.name,
                        color: result.color,
                        icon: result.icon,
                        subCategories: []
                    }

                    this.onUpdateCategory(category.id, category);
                } else {
                    result.id = Math.floor(Math.random() * 100000000);

                    let category: any = {
                        type: "Gasto",
                        name: result.name,
                        color: result.color,
                        icon: result.icon
                    }

                    this.onSaveCategory(category);
                }
            }
        });
    }

    onUpdateCategory(categoryId: number, category: any) {
        let success = (res: any) => {
            this.list();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.updateCategory(categoryId, category)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onSaveCategory(category: any) {
        let success = (res: any) => {
            this.items.push(res);
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.createCategory(category)
            .subscribe(this.extractDataService.extract(success, err));
    }

}
