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

	findPaidTransactionsInPeriod() {
		return this.httpService.get(this.url + this.appService.transactionUrl + `/date-now`);
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

	updateCurrentOthers(transaction: any, transactionId: number, fixedId: number) {
		return this.httpService.put(this.url + this.appService.transactionUrl + `/${transactionId}/fixed/${fixedId}`, transaction);
	}

	updateAllItens(transaction: any, transactionId: number, fixedId: number) {
		return this.httpService.put(this.url + this.appService.transactionUrl + `/${transactionId}/fixed/${fixedId}/all`, transaction);
	}

	delete(transactionId: number) {
		return this.httpService.delete(this.url + this.appService.transactionUrl + `/${transactionId}`);
	}

	deleteCurrentOthers(transactionId: number, fixedId: number) {
		return this.httpService.delete(this.url + this.appService.transactionUrl + `/${transactionId}/fixed/${fixedId}`);
	}

	createFixed(transaction: any) {
		return this.httpService.post(this.url + this.appService.fixedTransactionUrl, transaction);
	}

	updateFixed(transaction: any, transactionId: number, updateType: string) {
		return this.httpService.put(this.url + this.appService.fixedTransactionUrl + `/${transactionId}/update-type/${updateType}`, transaction);
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

	downloadFileById(fileId: number) {
		return this.httpService.getFile(this.url + this.appService.fileAttachment + `/download/${fileId}`);
	}



	teste(data: any) {
		return this.httpService.post(this.url + this.appService.transactionUrl + `/teste`, data);
	}

}
