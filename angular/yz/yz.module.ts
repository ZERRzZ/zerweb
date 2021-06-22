import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuTwoComponent } from './menu-two/menu-two.component';
import { SingleChoiceComponent } from './single-choice/single-choice.component';

@NgModule({
  declarations: [
    MenuTwoComponent,
    SingleChoiceComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuTwoComponent,
    SingleChoiceComponent
  ]
})
export class YzModule { }