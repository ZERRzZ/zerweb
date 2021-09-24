import { Component, EventEmitter, Input, Output } from '@angular/core'

import { debounce } from '../../../common/method'

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {

  constructor() { }

  @Input() page = 0 // 传入初始值

  @Output() pageChange = new EventEmitter<number>() // 传出改变后的值

  @Input() min = 0 // 最小值

  @Input() max = 10000 // 最大值

  add = () => {
    this.page < this.max && this.page++
    debounce(() => this.pageChange.emit(this.page), 1000)
  }

  setValue = (e: Event) => {
    let target = e.target as HTMLInputElement
    debounce(() => {
      this.page = Math.min(Math.max(Number(target.value.replace(/[^\d]/g, '')), this.min), this.max)
      target.value = this.page.toString()
      this.pageChange.emit(this.page)
    }, 1000)
  }

  sub = () => {
    this.page > this.min && this.page--
    debounce(() => this.pageChange.emit(this.page), 1000)
  }

  last = () => {
    this.page = this.max
    debounce(() => this.pageChange.emit(this.page), 1000)
  }

  first = () => {
    this.page = this.min
    debounce(() => this.pageChange.emit(this.page), 1000)
  }

}
