import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuTwoComponent } from './menu-two/menu-two.component';
import { SingleChoiceComponent } from './single-choice/single-choice.component';
import { CountComponent } from './count/count.component';

@NgModule({
  declarations: [
    MenuTwoComponent,
    SingleChoiceComponent,
    CountComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuTwoComponent,
    SingleChoiceComponent,
    CountComponent
  ]
})
export class YzModule { }