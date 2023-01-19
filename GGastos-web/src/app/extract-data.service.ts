import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExtractDataService {

    constructor() { }

    public extract(success: any, error: any, complete?: any) {
        return  {
            next: (v: any) => success ? success(v) : null,
            error: (e: any) => error ? error(e) : console.log('error', e),
            complete: () => complete ? complete : console.log('complete')
        }
    }
}
