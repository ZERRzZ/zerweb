import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountComponent } from 'yz/src/public-api';

const routes: Routes = [
  { path: '', redirectTo: 'count', pathMatch: 'full' },
  { path: 'count', component: CountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
