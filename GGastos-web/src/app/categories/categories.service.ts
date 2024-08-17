import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.baseUrl
	}

	findAll() {
		return this.httpService.get(this.url + this.appService.categoryUrl);
	}

	createCategory(category: any) {
		return this.httpService.post(this.url + this.appService.categoryUrl, category);
	}

	updateCategory(categoryId: number, category: any) {
		return this.httpService.put(this.url + this.appService.categoryUrl + `/${categoryId}`, category);
	}

	deleteCategory(categoryId: number) {
		return this.httpService.delete(this.url + this.appService.categoryUrl + `/${categoryId}`);
	}

	createSubCategory(category: any) {
		return this.httpService.post(this.url + this.appService.subCategoryUrl, category);
	}

	updateSubCategory(subCategoryId: number, subCategory: any) {
		return this.httpService.put(this.url + this.appService.subCategoryUrl + `/${subCategoryId}`, subCategory);
	}

	deleteSubCategory(subCategory: number) {
		return this.httpService.delete(this.url + this.appService.subCategoryUrl + `/${subCategory}`);
	}

	findSubCategoryByCategoryId(categoryId: number) {
		return this.httpService.get(this.url + this.appService.subCategoryUrl + `/${categoryId}`);
	}
}
