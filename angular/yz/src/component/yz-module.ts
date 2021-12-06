import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CountComponent } from "./count/count.component";
import { LegendComponent } from "./legend/legend.component";
import { BetterTableComponent } from "./better-table/better-table.component";
import { PageComponent } from "./better-table/page/page.component";
import { SearchComponent } from "./better-table/search/search.component";
import { SortComponent } from "./better-table/sort/sort.component";
import { SMenuComponent } from "./s-menu/s-menu.component";

@NgModule({
  declarations: [
    CountComponent,
    LegendComponent,
    SMenuComponent,
    SearchComponent, PageComponent, SortComponent, BetterTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CountComponent,
    LegendComponent,
    SMenuComponent,
    SearchComponent, PageComponent, SortComponent, BetterTableComponent
  ]
})
export class YZModule { }