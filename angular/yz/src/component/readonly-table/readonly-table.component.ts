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

  @Input() body = body

  @Input() line = 10 // 行数

  page = 1 // 当前页数

  max = 10000 // 最大页数

  min = 1 //最小页数

  trueBody: RTBody[] = []

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body) {
      this.max = Math.ceil(this.body.length / this.line)
      this.trueBody = this.bodySlice(this.body, this.line, this.page)
    }
  }

  pageChange = (e: number) => this.trueBody = this.bodySlice(this.body, this.line, e)

  // 根据页数来分割表格体
  bodySlice = <T>(body: T[], line: number, page: number) => {

    let arr: T[] = []
    let start = line * (page - 1)
    let end = Math.min(line * page, this.body.length)

    for (let i = start; i < end; i++)
      arr.push(body[i])

    return arr

  }

}