import { Component, Input } from '@angular/core';

import { legend } from './legend.test';

@Component({
  selector: 'legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent {

  constructor() { }

  @Input() legend = legend

  @Input() height = '200px'

}
