import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";

import { btbody, BTBody, BTHead, bthead } from "./better-table.model";

@Component({
  selector: 'better-table',
  templateUrl: './better-table.component.html',
  styleUrls: ['./better-table.component.css']
})
export class BetterTableComponent implements OnChanges, OnInit {

  constructor() { }

  @ViewChild('betterTableBody', { static: true }) btbody: ElementRef

  // 保证每次 body 传入时实时刷新
  // 初始化时加上 oninit 最大运行 3 次
  ngOnChanges() { this.tsearch(this.body) }

  // 保证初始化时不乱
  ngOnInit() { this.tsearch(this.body) }

  @Input() head: BTHead[] = bthead // 表头数据

  @Input() body: BTBody[] = btbody // 表体数据

  @Input() line = 10 // 最大行数

  @Input() click = false // 是否可点击

  @Input() id = 0 // 选中 id

  @Output() clickTr = new EventEmitter<BTBody>() // 传出选中的行数据

  /* 搜索, 排序, 分页 */

  page = 1 // 当前页数

  max = 10000 // 最大页数

  min = 1 //最小页数

  // body 是源, 首先根据搜索内容截取成 sbody, 在依此来排序成 obody, 最后分页成 pbody 应用

  sbody: BTBody[] = [] // 搜索

  obody: BTBody[] = [] // 排序

  pbody: BTBody[] = [] // 分页

  tsearch = (e: BTBody[]) => {
    this.sbody = e
    this.max = Math.ceil(this.sbody.length / this.line) // 最大页数由搜索后的内容决定
    this.tsort(e) // 搜索完排序、返回第一页、回到头部
  }

  tsort = (e: BTBody[]) => {
    this.obody = e
    this.tpage(this.page = 1) // 返回第一页、回到头部
  }

  tpage = (e: number) => {
    this.btbody.nativeElement.scrollTop = 0 // 返回表格头部
    this.btbody.nativeElement.classList.add('slowshow') // 添加切换动画
    this.pbody = this.obody.slice(this.line * (e - 1), Math.min(this.line * e, this.obody.length)) // 翻页
    setTimeout(() => this.btbody.nativeElement.classList.remove('slowshow'), 400) // 重置动画
  }

  /* 行点击 */

  trClick = (p: BTBody) => {
    this.id = p.id
    this.clickTr.emit(p)
  }

}