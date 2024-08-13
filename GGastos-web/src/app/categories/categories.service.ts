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

	createSubCategory(category: any) {
		return this.httpService.post(this.url + this.appService.subCategoryUrl, category);
	}
}
