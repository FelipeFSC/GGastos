import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';
import { Card } from './card.model';

@Injectable({
	providedIn: 'root'
})
export class CardsService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.baseUrl
	}

	findByEnabled(enabled: boolean) {
		return this.httpService.get(this.url + this.appService.cardUrl + `/enabled/${enabled}`);
	}

	create(card: Card) {
		return this.httpService.post(this.url + this.appService.cardUrl, card);
	}

	update(cardId: number, card: Card) {
		return this.httpService.put(this.url + this.appService.cardUrl + `/${cardId}`, card);
	}

	delete(cardId: number) {
		return this.httpService.delete(this.url + this.appService.cardUrl + `/${cardId}`);
	}

}
