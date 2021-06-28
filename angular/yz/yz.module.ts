import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuTwoComponent } from './menu-two/menu-two.component';
import { SingleChoiceComponent } from './single-choice/single-choice.component';
import { CountComponent } from './count/count.component';
import { MapLegendComponent } from './map-legend/map-legend.component';

@NgModule({
  declarations: [
    MenuTwoComponent,
    SingleChoiceComponent,
    CountComponent,
    MapLegendComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuTwoComponent,
    SingleChoiceComponent,
    CountComponent,
    MapLegendComponent
  ]
})
export class YzModule { }