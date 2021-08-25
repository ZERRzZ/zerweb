import { Component, EventEmitter, Input, Output } from '@angular/core';

import { debounce } from '../common/method/debounce'

import { Count } from '../common/model/count.model';

import count from './count';

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
