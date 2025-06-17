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

	findByDate(date: string) {
		return this.httpService.get(this.url + this.appService.transactionUrl + `/date/${date}`);
	}

	findAll() {
		return this.httpService.get(this.url + this.appService.transactionUrl);
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

	update(transaction: any, transactionId: number) {
		return this.httpService.put(this.url + this.appService.transactionUrl + `/${transactionId}`, transaction);
	}

	delete(transactionId: number) {
		return this.httpService.delete(this.url + this.appService.transactionUrl + `/${transactionId}`);
	}

	createFixed(transaction: any) {
		return this.httpService.post(this.url + this.appService.fixedTransactionUrl, transaction);
	}

	updateFixed(transaction: any, transactionId: number) {
		return this.httpService.put(this.url + this.appService.fixedTransactionUrl + `/${transactionId}`, transaction);
	}

	deleteFixed(transactionId: number) {
		return this.httpService.delete(this.url + this.appService.fixedTransactionUrl + `/${transactionId}`);
	}

	isPaid(transactionId: number) {
		return this.httpService.patch(this.url + this.appService.transactionUrl + `/${transactionId}/is-paid`, null);
	}

	findExpiredUnpaid(transactionId: number) {
		return this.httpService.get(this.url + this.appService.transactionUrl + `/${transactionId}/expired-unpaid`);
	}




	teste(data: any) {
		return this.httpService.post(this.url + this.appService.transactionUrl + `/teste`, data);
	}

}
