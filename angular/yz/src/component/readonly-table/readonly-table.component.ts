import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

import { RTBody } from "../../common/model";

import { body, head } from "./readonly-table.test";

@Component({
  selector: 'readonly-table',
  templateUrl: './readonly-table.component.html',
  styleUrls: ['./readonly-table.component.css']
})
export class ReadonlyTableComponent implements OnChanges {

  constructor() { }

  @Input() head = head

  @Input() body = body // 源

  @Input() line = 10 // 行数

  page = 1 // 当前页数

  max = 10000 // 最大页数

  min = 1 //最小页数

  // body 是源, 首先根据搜索内容截取成 sbody, 在依此来排序成 obody, 最后分页成 pbody 应用

  pbody: RTBody[] = [] // 分页

  sbody: RTBody[] = [] // 搜索

  obody: RTBody[] = [] // 排序

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body && !changes.body.isFirstChange())
      this.bodySearch(this.body)
  }

  // 根据页数来分割表格体
  bodySlice = <T>(body: T[], line: number, page: number) => {

    let arr: T[] = []
    let start = line * (page - 1)
    let end = Math.min(line * page, body.length)

    for (let i = start; i < end; i++)
      arr.push(body[i])

    return arr

  }

  // 翻页
  pageChange = (e: number) => this.pbody = this.bodySlice(this.obody, this.line, e)

  // 搜索特定内容
  bodySearch = (e: RTBody[]) => {

    this.sbody = e
    this.max = Math.ceil(this.sbody.length / this.line) // 最大页数由搜索后的内容决定

    this.bodySort(e)

  }

  // 排序
  bodySort = (e: RTBody[]) => {

    this.obody = e

    this.pageChange(this.page)

  }

}