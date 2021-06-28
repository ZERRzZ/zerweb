import { Component, Input } from '@angular/core';

import { mapLegend } from './map-legend';

@Component({
  selector: 'map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.css']
})
export class MapLegendComponent {

  constructor() { }

  @Input() mapLegend = mapLegend
  @Input() height = '200px'

}
