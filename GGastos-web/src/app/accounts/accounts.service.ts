import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';
import { Account } from './account.model';

@Injectable({
	providedIn: 'root'
})
export class AccountsService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.baseUrl
	}

	findByEnabled(enabled: boolean) {
		return this.httpService.get(this.url + this.appService.accountUrl + `/enabled/${enabled}`);
	}

	findOne(accountId: number) {
		return this.httpService.get(this.url + this.appService.accountUrl + `/${accountId}`);
	}

	create(account: Account) {
		return this.httpService.post(this.url + this.appService.accountUrl, account);
	}

	update(accountId: number, account: Account) {
		return this.httpService.put(this.url + this.appService.accountUrl + `/${accountId}`, account);
	}

	disable(accountId: number) {
		return this.httpService.delete(this.url + this.appService.accountUrl + `/${accountId}`);
	}
}