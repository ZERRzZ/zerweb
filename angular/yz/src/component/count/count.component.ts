import { Component, EventEmitter, Input, Output } from '@angular/core'

import { debounce } from '../../common/method';

@Component({
  selector: 'count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent {

  constructor() { }

  @Input() value = 9999 // 传入初始值

  @Output() valueChange = new EventEmitter<number>() // 传出改变后的值

  @Input() min = 0 // 最小值

  @Input() max = 10000 // 最大值

  add = () => {
    this.value < this.max && this.value++
    debounce(() => this.valueChange.emit(this.value), 1000)
  }

  setValue = (e: Event) => {
    let target = e.target as HTMLInputElement
    debounce(() => {
      this.value = Math.min(Math.max(Number(target.value.replace(/[^\d]/g, '')), this.min), this.max)
      target.value = this.value.toString()
      this.valueChange.emit(this.value)
    }, 1000)
  }

  sub = () => {
    this.value > this.min && this.value--
    debounce(() => this.valueChange.emit(this.value), 1000)
  }
}
