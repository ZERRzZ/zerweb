import { Component, EventEmitter, Input, Output } from '@angular/core';

import { debounce } from '../common/method/debounce'

@Component({
  selector: 'count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent {

  constructor() { }

  @Input() value = 0 // 传入初始值

  @Output() changeValue = new EventEmitter<number>() // 传出改变后的值

  add = () => {
    this.value++
    debounce(() => this.changeValue.emit(this.value), 1000)
  }

  setValue = (e: Event) => {
    let target = e.target as HTMLInputElement
    debounce(() => {
      this.value = Number(target.value.replace(/[^\d]/g, ''))
      target.value = this.value.toString()
      this.changeValue.emit(this.value)
    }, 1000)
  }

  sub = () => {
    this.value > 0 && this.value--
    debounce(() => this.changeValue.emit(this.value), 1000)
  }
}
