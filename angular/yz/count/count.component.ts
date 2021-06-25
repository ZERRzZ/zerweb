import { Component, EventEmitter, Input, Output } from '@angular/core';

import { debounce } from '../../../method/debounce'

import { count } from './count';
import { Count } from './count.model';

@Component({
  selector: 'count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent {

  constructor() { }

  @Input() count = count
  @Output() resetCount = new EventEmitter

  setValue(e: HTMLInputElement, count: Count) {
    e.value = e.value.replace(/[^\d]/g, '')
    debounce(() => {
      count.value = +e.value
      this.resetCount.emit(count)
    }, 1000)
  }
}
