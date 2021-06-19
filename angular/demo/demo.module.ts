import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { YzModule } from 'yz/yz.module';

import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    BrowserModule,
    YzModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})
export class AppModule { }