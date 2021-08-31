import { Component, EventEmitter, Input, Output } from '@angular/core';

import { singleChoice } from './single-choice';

@Component({
  selector: 'single-choice',
  templateUrl: './single-choice.component.html',
  styleUrls: ['./single-choice.component.css']
})
export class SingleChoiceComponent {

  constructor() { }

  @Input() singleChoice = singleChoice
  @Input() select = 0

  @Output() reselect = new EventEmitter

}
