import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CountComponent, LegendComponent, SMenuComponent } from 'yz/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    CountComponent,
    SMenuComponent,
    LegendComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
