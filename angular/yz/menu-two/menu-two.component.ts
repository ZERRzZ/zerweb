import { Component, EventEmitter, Input, Output } from '@angular/core';

import { menuTwo } from './menu-two'

@Component({
  selector: 'menu-two',
  templateUrl: './menu-two.component.html',
  styleUrls: ['./menu-two.component.css']
})
export class MenuTwoComponent {

  constructor() { }

  // 菜单数据, 需指定格式, 有默认值
  // 当数据中没有 open 属性时统一设置为 this.open 的值, 当数据中有 open 属性时不会去改变它
  @Input()
  get menuTwo() { return this._menuTwo }
  set menuTwo(menuTwo) {
    menuTwo.forEach(v => {
      v.id == this.select[0] && (v.open = true)
      v.open == undefined && (v.open = this.open)
    })
    this._menuTwo = menuTwo
  }
  private _menuTwo = menuTwo

  @Input() select = [0, 0] // 初始选中菜单的那一项 [二级菜单 id, 一级菜单 id]
  @Input() open = false // 菜单是否打开, 默认不打开
  @Output() reselect = new EventEmitter // 传出所选中的 select [二级菜单 id, 一级菜单 id], 当点击子项时触发
}