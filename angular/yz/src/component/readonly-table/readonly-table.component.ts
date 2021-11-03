import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { RTBody } from "../../common/model";

import { body, head } from "./readonly-table.test";

@Component({
  selector: 'readonly-table',
  templateUrl: './readonly-table.component.html',
  styleUrls: ['./readonly-table.component.css']
})
export class ReadonlyTableComponent implements OnChanges, OnInit {

  constructor() { }

  @Input() head = head

  @Input() body = body // 源

  @Input() line = 10 // 行数

  page = 1 // 当前页数

  max = 10000 // 最大页数

  min = 1 //最小页数

  // body 是源, 首先根据搜索内容截取成 sbody, 在依此来排序成 obody, 最后分页成 pbody 应用

  sbody: RTBody[] = [] // 搜索

  obody: RTBody[] = [] // 排序

  pbody: RTBody[] = [] // 分页

  ngOnInit() { this.tsearch(this.body) }

  ngOnChanges(changes: SimpleChanges) { if (changes.body && !changes.body.isFirstChange()) this.tsearch(this.body) }

  // 搜索
  tsearch = (e: RTBody[]) => {

    this.sbody = e
    this.max = Math.ceil(this.sbody.length / this.line) // 最大页数由搜索后的内容决定

    this.tsort(e)

  }

  // 排序
  tsort = (e: RTBody[]) => {

    this.obody = e

    this.tpage(this.page)

  }

  // 翻页
  tpage = (e: number) => this.pbody = this.obody.slice(this.line * (e - 1), Math.min(this.line * e, body.length))

}