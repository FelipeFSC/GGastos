import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';
import { HttpService } from '../http.service';

@Injectable({
	providedIn: 'root'
})
export class ReportsService {

    private url: string = "";

	constructor(
		private httpService: HttpService,
		private appService: AppConfigService) {
		this.url = this.appService.baseUrl
	}

	getCategoryReportDto(categoryTypeId: number) {
		return this.httpService.get(this.url + this.appService.reportsUrl + `/category-report/${categoryTypeId}`);
	}

}
