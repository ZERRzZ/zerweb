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

  pbody: RTBody[] = [] // 分页的依据

  sbody: RTBody[] = [] // 搜索的依据

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body && !changes.body.isFirstChange())
      this.bodySearch(this.body)
  }

  pageChange = (e: number) => this.pbody = this.bodySlice(this.sbody, this.line, e)

  // 根据页数来分割表格体
  bodySlice = <T>(body: T[], line: number, page: number) => {

    let arr: T[] = []
    let start = line * (page - 1)
    let end = Math.min(line * page, body.length)

    for (let i = start; i < end; i++)
      arr.push(body[i])

    return arr

  }

  // 搜索特定内容
  bodySearch = (e: RTBody[]) => {
    this.sbody = e
    this.max = Math.ceil(this.sbody.length / this.line)
    this.pbody = this.bodySlice(this.sbody, this.line, this.page)
  }

}