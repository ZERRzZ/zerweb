import { Component, EventEmitter, Input, Output } from "@angular/core";

import { supermenu, SuperMenu } from "./super-menu.model";

@Component({
  selector: 'super-menu',
  templateUrl: './super-menu.component.html',
  styleUrls: ['./super-menu.component.css']
})
export class SuperMenuComponent {

  constructor() { }

  @Input() origin: SuperMenu[] = supermenu

  @Input() smenu: SuperMenu[] = supermenu

  @Output() selectmenu = new EventEmitter<SuperMenu>()

  @Output() selectMenu = new EventEmitter<SuperMenu>()

  select = (s: SuperMenu) => {

    this.clearAll(this.origin)

    s.select = true

    this.setSelect(this.origin)

    this.selectmenu.emit(s)

  }

  // 清除所有选中状态
  clearAll = (menu: SuperMenu[]) => {
    menu.forEach(v => {
      v.select = false
      if (v.children) this.clearAll(v.children)
    })
  }

  // 给一个树上的菜单项 select 属性赋值
  // 先递归到最底层, 再逐层往上, 如果子项有一项 select 为真, 则给父项也设为真
  setSelect = (menu: SuperMenu[]) => {
    menu.forEach(v => {
      if (v.children) {
        this.setSelect(v.children)
        v.select = !v.children.every(vv => vv.select == false)
      }
    })
  }

}