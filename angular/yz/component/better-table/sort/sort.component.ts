import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BTBody, BTHead } from "../better-table.model";

@Component({
  selector: 'sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent {

  constructor() { }

  @Input() head: BTHead[] = []

  @Input() sbody: BTBody[] = []

  @Output() sbodyChange = new EventEmitter<BTBody[]>()

  showorder = false // 控制排序列表显示

  order: 'init' | 'up' | 'down' = "init" // 排序状态

  sid = 0 // 选中的标题 id

  lastsid = 0 // 上一次选中的标题 id

  // 显示与隐藏
  show = () => {
    if (this.showorder) {
      document.getElementById('betterTableSort')!.classList.add('downhide')
      setTimeout(() => this.showorder = false, 400)
    } else {
      this.showorder = true
    }
  }

  // 排序
  sort = (h: BTHead) => {

    // 先将此次 id 赋给当前选中 id
    this.sid = h.id 
    // 当点击不同项时防止混乱
    this.lastsid !== this.sid && (this.order = 'init')
    // 再将此次 id 赋给上次选中 id
    this.lastsid = h.id

    let sbody = [...this.sbody] // 防引用

    if (this.order == 'init') {

      this.order = 'up'

      sbody.sort((a, b) => a[h.field] < b[h.field] ? -1 : 1)

    } else if (this.order == 'up') {

      this.order = 'down'

      sbody.sort((a, b) => a[h.field] < b[h.field] ? 1 : -1)

    } else { this.order = 'init' }

    this.sbodyChange.emit(sbody)

  }

}