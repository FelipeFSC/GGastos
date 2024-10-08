import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigService {

	constructor() { }

	private privateBaseUrl: string = 'http://localhost:8081';

	private privateCategory: string = "/category";

	private privateSubCategory: string = "/sub-category";

	private privateAccount: string = "/accounts";

	private privateCard: string = "/credit-cards"

	public get baseUrl(): string {
		return this.privateBaseUrl;
	}

	public get categoryUrl() {
		return this.privateCategory;
	}

	public get subCategoryUrl() {
		return this.privateSubCategory;
	}

	public get accountUrl() {
		return this.privateAccount;
	}

	public get cardUrl(): string {
		return this.privateCard;
	}
}
