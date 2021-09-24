import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CountComponent } from "./count/count.component";
import { LegendComponent } from "./legend/legend.component";
import { PageComponent } from "./readonly-table/page/page.component";
import { ReadonlyTableComponent } from "./readonly-table/readonly-table.component";
import { SMenuComponent } from "./s-menu/s-menu.component";

@NgModule({
  declarations: [
    CountComponent,
    LegendComponent,
    SMenuComponent,
    PageComponent,
    ReadonlyTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CountComponent,
    LegendComponent,
    SMenuComponent,
    PageComponent,
    ReadonlyTableComponent
  ]
})
export class YZModule { }