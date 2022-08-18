import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { YZModule } from '../../yz/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    RouterModule,
    YZModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
