import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountComponent, LegendComponent, BetterTableComponent, SMenuComponent } from 'yz/src/public-api';

const routes: Routes = [
  { path: 'count', component: CountComponent },
  { path: 'legend', component: LegendComponent },
  { path: 'better-table', component: BetterTableComponent },
  { path: 's-menu', component: SMenuComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
