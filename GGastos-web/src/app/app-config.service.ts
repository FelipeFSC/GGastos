import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigService {

	constructor() { }

	private privateBaseUrl: string = 'http://localhost:8081';

	private privateCategory: string = "/categories";

	private privateSubCategory: string = "/subcategory";

	public get baseUrl(): string {
		return this.privateBaseUrl;
	}

	public get categoryUrl() {
		return this.privateCategory;
	}

	public get subCategoryUrl() {
		return this.privateSubCategory;
	}
}
