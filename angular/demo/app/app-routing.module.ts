import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CounterComponent, LegendComponent, BetterTableComponent, SMenuComponent, SuperMenuComponent, DropDownComponent, FloatMenuComponent, PlayBarComponent, TagsChooseComponent } from 'yz/public-api';

const routes: Routes = [
  { path: 'better-table', component: BetterTableComponent },
  { path: 'counter', component: CounterComponent },
  { path: 'drop-down', component: DropDownComponent },
  { path: 'float-menu', component: FloatMenuComponent },
  { path: 'legend', component: LegendComponent },
  { path: 'play-bar', component: PlayBarComponent },
  { path: 's-menu', component: SMenuComponent },
  { path: 'super-menu', component: SuperMenuComponent },
  { path: 'tags-choose', component: TagsChooseComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
