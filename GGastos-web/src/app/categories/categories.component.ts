import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../dialog/category-dialog/category-dialog.component';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from './categories.service';
import { SubCategoryDialogComponent } from '../dialog/sub-category-dialog/sub-category-dialog.component';

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
            // console.log(res);
            let list: any[] = [];
            for (let item of res) {
                let category = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color,
                    type: item.type,
                    enabled: item.enabled,
                    isOpen: false
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

    onAddCategory(category?: any|undefined) {
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

                    let category: any = {
                        type: "Gasto",
                        name: result.name,
                        color: result.color,
                        icon: result.icon,
                        subCategories: []
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
            this.list();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.createCategory(category)
            .subscribe(this.extractDataService.extract(success, err));
    }

    onAddSubCategory(category?: any|undefined) {
        let dialogRef = this.dialog.open(SubCategoryDialogComponent, {
            width: '400px',
            data: { categories: this.items, edit: ((category ? category : null))}
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
                    let subCategory: any = {
                        name: result.name,
                        category: {
                            id: result.categoryId
                        }
                    }
                    this.onSaveSubCategory(subCategory);
                }
            }
        });
    }

    onSaveSubCategory(subCategory: any) {
        let success = (res: any) => {
            this.list();
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.createSubCategory(subCategory)
            .subscribe(this.extractDataService.extract(success, err));
    }

    loadSubCategory(category: any) {
        category.isOpen = !category.isOpen;

        if (category.isOpen) {
            console.log("CARREGA");
            
        }
    }

}
