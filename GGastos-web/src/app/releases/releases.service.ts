import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';

@Injectable({
	providedIn: 'root'
})
export class ReleasesService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.baseUrl
	}

	findAll(date: string) {
		return this.httpService.get(this.url + this.appService.transactionUrl + `/date/${date}`);
	}

	findOneTransaction(id: number) {
		return this.httpService.get(this.url + this.appService.transactionUrl + `/${id}`);
	}

	findOneFixeTransaction(id: number) {
		return this.httpService.get(this.url + this.appService.fixedTransactionUrl + `/${id}`);
	}

	create(transaction: any) {
		return this.httpService.post(this.url + this.appService.transactionUrl, transaction);
	}

	createFixed(transaction: any) {
		return this.httpService.post(this.url + this.appService.fixedTransactionUrl, transaction);
	}

	isPaid(transactionId: number) {
		return this.httpService.patch(this.url + this.appService.transactionUrl + `/${transactionId}/is-paid`, null);
	}

}
