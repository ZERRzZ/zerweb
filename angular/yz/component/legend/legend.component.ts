import { Component, Input } from '@angular/core';

import { Legend, legend } from './legend.model';

@Component({
  selector: 'legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent {

  constructor() { }

  @Input() legend: Legend[] = legend

  @Input() height: string = '200px'

}
