import { Component, EventEmitter, Input, Output } from "@angular/core";

import { RTBody, RTHead } from "../readonly-table.model";

@Component({
  selector: 'sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent {

  constructor() { }

  @Input() head: RTHead[] = []

  @Input() body: RTBody[] = []

  @Output() bodyChange = new EventEmitter<RTBody[]>()

  shows = false

  type = "init" // 升序还是降序

  clickIndex = -1 // 点击的 id

  // 显示与隐藏
  show = () => {
    if (this.shows) {
      let sortbox1 = document.getElementById('sortbox1')
      sortbox1?.classList.remove('upup')
      sortbox1?.classList.add('downdown')
      setTimeout(() => this.shows = false, 400)
    } else {
      this.shows = true
    }
  }

  // 排序
  sort = (field: string, index: number) => {

    this.clickIndex = index // 控制样式变化

    let body = [...this.body] // 防引用

    if (this.type == 'init') {

      this.type = 'shengxu'
      
      body.sort((a, b) => {
        if (a[field] < b[field]) return -1
        else return 1
      })

    } else if (this.type == 'shengxu') {

      this.type = 'jiangxu'

      body.sort((a, b) => {
        if (a[field] < b[field]) return 1
        else return -1
      })

    } else {

      this.type = 'init'

    }

    this.bodyChange.emit(body)

  }

}