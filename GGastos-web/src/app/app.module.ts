import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './dialog/dialog.module';
import { HttpService } from './http.service';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';

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
        HttpClientModule
    ],
    providers: [
        AppConfigService,
        HttpService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
