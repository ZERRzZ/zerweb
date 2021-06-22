import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SingleChoice } from './single-choice.model';
import { singleChoice } from './single-choice';

@Component({
  selector: 'single-choice',
  templateUrl: './single-choice.component.html',
  styleUrls: ['./single-choice.component.css']
})
export class SingleChoiceComponent {

  constructor() { }

  @Input() singleChoice: SingleChoice = singleChoice
  @Input() select: number = 0

  @Output() reselect = new EventEmitter

}
