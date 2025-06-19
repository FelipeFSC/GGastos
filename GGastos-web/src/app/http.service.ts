import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

	constructor(private http: HttpClient) { }

	get(url: string) {
		return this.http.get(url);
	}

	getFile(url: string) {
		return this.http.get(url, { responseType: 'blob' });
	}

	getFileNotAuth(url: string) {
		return this.http.get(url, { responseType: 'blob' });
	}

	postFile(url: string, data: any) {
		return this.http.post(url, data);
	}

	post(url: string, data: any) {
		return this.http.post(url, data, );
	}

	put(url: string, data: any) {
		return this.http.put(url, data);
	}

	patch(url: string, data: any) {
		return this.http.patch(url, data);
	}

	delete(url: string) {
		return this.http.delete(url);
	}
}