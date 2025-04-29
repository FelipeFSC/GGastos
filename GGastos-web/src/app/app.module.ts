import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './dialog/dialog.module';
import { HttpService } from './http.service';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { ReportsModule } from './reports/reports.module';

registerLocaleData(localePt);
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
        DialogModule,
        HttpClientModule,
        ReportsModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        AppConfigService,
        HttpService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
