import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SearchComponent } from "./better-table/search/search.component";
import { PageComponent } from "./better-table/page/page.component";
import { SortComponent } from "./better-table/sort/sort.component";
import { BetterTableComponent } from "./better-table/better-table.component";

import { CounterComponent } from "./counter/counter.component";

import { DropDownComponent } from "./drop-down/drop-down.component";

import { FloatMenuComponent } from "./float-menu/float-menu.component";

import { LegendComponent } from "./legend/legend.component";

import { PlayBarComponent } from "./play-bar/play-bar.component";

import { SMenuComponent } from "./s-menu/s-menu.component";

import { SuperMenuComponent } from "./super-menu/super-menu.component";

import { TagsChooseComponent } from "./tags-choose/tags-choose.component";

@NgModule({
  declarations: [
    SearchComponent, PageComponent, SortComponent, BetterTableComponent,
    CounterComponent,
    DropDownComponent,
    FloatMenuComponent,
    LegendComponent,
    PlayBarComponent,
    SMenuComponent,
    SuperMenuComponent,
    TagsChooseComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BetterTableComponent,
    CounterComponent,
    DropDownComponent,
    FloatMenuComponent,
    LegendComponent,
    PlayBarComponent,
    SMenuComponent,
    SuperMenuComponent,
    TagsChooseComponent
  ]
})
export class YZModule { }