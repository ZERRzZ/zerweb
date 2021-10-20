import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CountComponent } from "./count/count.component";
import { LegendComponent } from "./legend/legend.component";
import { ReadonlyTableComponent } from "./readonly-table/readonly-table.component";
import { PageComponent } from "./readonly-table/page/page.component";
import { SearchComponent } from "./readonly-table/search/search.component";
import { SortComponent } from "./readonly-table/sort/sort.component";
import { SMenuComponent } from "./s-menu/s-menu.component";

@NgModule({
  declarations: [
    CountComponent,
    LegendComponent,
    SMenuComponent,
    SearchComponent, PageComponent, SortComponent, ReadonlyTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CountComponent,
    LegendComponent,
    SMenuComponent,
    SearchComponent, PageComponent, SortComponent, ReadonlyTableComponent
  ]
})
export class YZModule { }