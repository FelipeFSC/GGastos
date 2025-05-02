import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';

@Injectable({
	providedIn: 'root'
})
export class SpendingLimitService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.baseUrl
	}

	create(spendingLimit: any) {
		return this.httpService.post(this.url + this.appService.spendingLimitUrl, spendingLimit);
	}

	update(spendingLimitId: number, spendingLimit: any) {
		return this.httpService.put(this.url + this.appService.spendingLimitUrl + `/${spendingLimitId}`, spendingLimit);
	}

	findAll() {
		return this.httpService.get(this.url + this.appService.spendingLimitUrl);
	}

	findCurrentMonth() {
		return this.httpService.get(this.url + this.appService.spendingLimitUrl + `/current-month`);
	}
}
