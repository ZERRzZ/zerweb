import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SearchComponent } from "./better-table/search/search.component";
import { PageComponent } from "./better-table/page/page.component";
import { SortComponent } from "./better-table/sort/sort.component";
import { BetterTableComponent } from "./better-table/better-table.component";

import { CounterComponent } from "./counter/counter.component";

import { DropDownComponent } from "./drop-down/drop-down.component";

import { LegendComponent } from "./legend/legend.component";

import { SMenuComponent } from "./s-menu/s-menu.component";

import { SuperMenuComponent } from "./super-menu/super-menu.component";

@NgModule({
  declarations: [
    SearchComponent, PageComponent, SortComponent, BetterTableComponent,
    CounterComponent,
    DropDownComponent,
    LegendComponent,
    SMenuComponent,
    SuperMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BetterTableComponent,
    CounterComponent,
    DropDownComponent,
    LegendComponent,
    SMenuComponent,
    SuperMenuComponent
  ]
})
export class YZModule { }