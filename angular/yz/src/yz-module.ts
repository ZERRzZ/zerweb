import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CountComponent } from "./count/count.component";
import { LegendComponent } from "./legend/legend.component";
import { SMenuComponent } from "./s-menu/s-menu.component";

@NgModule({
  declarations: [
    CountComponent,
    LegendComponent,
    SMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CountComponent,
    LegendComponent,
    SMenuComponent
  ]
})
export class YZModule { }