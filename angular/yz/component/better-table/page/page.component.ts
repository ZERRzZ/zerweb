import { Component, EventEmitter, Input, Output } from '@angular/core'

import { debounce } from '../../../common/method'

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {

  constructor() { }

  @Input() page = 0 // 初始页数

  @Output() pageChange = new EventEmitter<number>()

  @Input() min = 0 // 最小页数
  
  @Input() max = 10000 // 最大页数

  // 第一页
  first = () => {
    this.page = this.min
    debounce(() => this.pageChange.emit(this.page), 500)
  }

  // 上一页
  pre = () => {
    this.page > this.min && this.page--
    debounce(() => this.pageChange.emit(this.page), 500)
  }

  // 任意页数
  any = (e: Event) => {
    let target = e.target as HTMLInputElement
    debounce(() => {
      this.page = Math.min(Math.max(Number(target.value.replace(/[^\d]/g, '')), this.min), this.max)
      target.value = this.page.toString()
      this.pageChange.emit(this.page)
    }, 500)
  }

  // 下一页
  next = () => {
    this.page < this.max && this.page++
    debounce(() => this.pageChange.emit(this.page), 500)
  }

  // 最后一页
  last = () => {
    this.page = this.max
    debounce(() => this.pageChange.emit(this.page), 500)
  }

}
