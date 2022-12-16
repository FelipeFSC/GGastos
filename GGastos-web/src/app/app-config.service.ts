import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigService {

	constructor() { }

	private privateBaseUrl: string = 'http://localhost:8076';

	public get baseUrl(): string {
		return this.privateBaseUrl;
	}
}
