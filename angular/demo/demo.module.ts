import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { YzModule } from 'yz/yz.module';

import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    YzModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})
export class AppModule { }