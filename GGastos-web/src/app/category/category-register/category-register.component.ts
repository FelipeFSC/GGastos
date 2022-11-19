import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../category';

@Component({
    selector: 'app-category-register',
    templateUrl: './category-register.component.html',
    styleUrls: ['./category-register.component.css']
})
export class CategoryRegisterComponent implements OnInit {

    title: string = "Cadastro de categoria";

    categoryName = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    categoryType = new FormControl('', [Validators.required]);

    category: Category.Category = { id: 0 };

    categories: any[] = [
        {id: '1', name: 'Despesa'},
        {id: '2', name: 'Recebimento'},
    ];

    constructor(
        private router: Router,
    ) { }

    ngOnInit(): void {
    }

    onSave() {
        console.log(this.category);
    }

    onClose() {
        this.router.navigate(['category']);
    }

    getCategoryNameErrorMessage() {
        if (this.categoryName.hasError('required')) {
            return 'Campo obrigatório';
        }
        return this.categoryName.hasError('maxLength') ? '' : 'Tentando burlar o sistema, NÉ? SAFADO!!!';
    }

    getCategoryTypeErrorMessage() {
        return this.categoryType.hasError('required') ? 'Campo obrigatório' : 'aaaa';
    }
}
