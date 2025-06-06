import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';

@Injectable({
	providedIn: 'root'
})
export class InvestmentsService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.n8nUrl
	}

	getResume() {
		return this.httpService.get(this.url + `/resume`);
	}

	getFii(name: string) {
		return this.httpService.get(this.url + `/fundo?nome=${name}`);
	}

}
