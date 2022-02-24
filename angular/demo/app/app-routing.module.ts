import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CounterComponent, LegendComponent, BetterTableComponent, SMenuComponent, SuperMenuComponent, DropDownComponent, FloatMenuComponent } from 'yz/public-api';

const routes: Routes = [
  { path: 'better-table', component: BetterTableComponent },
  { path: 'counter', component: CounterComponent },
  { path: 'drop-down', component: DropDownComponent },
  { path: 'float-menu', component: FloatMenuComponent },
  { path: 'legend', component: LegendComponent },
  { path: 's-menu', component: SMenuComponent },
  { path: 'super-menu', component: SuperMenuComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
