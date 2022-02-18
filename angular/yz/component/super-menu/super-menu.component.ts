import { Component, Input } from "@angular/core";

import { supermenu, SuperMenu } from "./super-menu.model";

@Component({
  selector: 'super-menu',
  templateUrl: './super-menu.component.html',
  styleUrls: ['./super-menu.component.css']
})
export class SuperMenuComponent {

  constructor() { }

  @Input() origin: SuperMenu[] = supermenu // 原始数据

  @Input() smenu: SuperMenu[] = supermenu

  select = (s: SuperMenu) => {

    let idArr = s.id.split('.') // 拆解 id
    let ids: string[] = []

    while (idArr.length) { // 将一个 id 分成多个选中的 id
      ids.push(idArr.reduce((p, v) => p + `.${v}`))
      idArr.pop()
    }

    // this.superforEach(this.smenu, ids)

    this.smenu.find(v => v.id == s.id)!.select = true

    console.log(this.smenu)
    console.log(s)
    console.log(ids)

  }

  // 循环为 SuperMenu 类型的 select 赋值, 实现选中效果
  superforEach = (smenu: SuperMenu[], ids: string[]) => {
    smenu.forEach(s => {
      s.select = ids.every(i => i == s.id)
      s.children && this.superforEach(s.children, ids)
    })
  }

}