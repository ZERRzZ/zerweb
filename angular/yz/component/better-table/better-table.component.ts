import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

import { BTBody } from "./better-table.model";
import { body, head } from "./better-table.test";

@Component({
  selector: 'better-table',
  templateUrl: './better-table.component.html',
  styleUrls: ['./better-table.component.css']
})
export class BetterTableComponent implements OnChanges, OnInit {

  constructor() { }

  ngOnInit() { this.tsearch(this.body) }

  ngOnChanges(changes: SimpleChanges) { if (changes.body && !changes.body.isFirstChange()) this.tsearch(this.body) }

  @Input() head = head

  @Input() body = body // 源

  @Input() line = 10 // 行数

  @Input() click = false // 是否可点击

  @Input() id = 0 // 选中 id

  @Output() clickTr = new EventEmitter<BTBody>()

  /* 搜索, 排序, 分页 */

  page = 1 // 当前页数

  max = 10000 // 最大页数

  min = 1 //最小页数

  // body 是源, 首先根据搜索内容截取成 sbody, 在依此来排序成 obody, 最后分页成 pbody 应用

  sbody: BTBody[] = [] // 搜索

  obody: BTBody[] = [] // 排序

  pbody: BTBody[] = [] // 分页

  tsearch = (e: BTBody[]) => { // 搜索
    this.sbody = e
    this.max = Math.ceil(this.sbody.length / this.line) // 最大页数由搜索后的内容决定
    this.tsort(e) // 排序、返回第一页、回到头部
  }

  tsort = (e: BTBody[]) => { // 排序
    this.obody = e
    this.tpage(this.page = 1) // 返回第一页、回到头部
  }

  tpage = (e: number) => {

    this.pbody = this.obody.slice(this.line * (e - 1), Math.min(this.line * e, this.obody.length)) // 翻页

    // 返回表格头部
    let betterTableBody = document.getElementById('betterTableBody')
    betterTableBody!.scrollTop = 0

  }

  /* 行点击 */

  onclick = (p: BTBody) => {
    this.id = p.id
    this.clickTr.emit(p)
  }

}