import { Component, Input } from '@angular/core';

// 二级菜单数据格式与模拟数据
import { MenuTwo } from './menu-two.model';
import { menuTwo } from './menu-two'

@Component({
  selector: 'menu-two',
  templateUrl: './menu-two.component.html',
  styleUrls: ['./menu-two.component.css']
})
export class MenuTwoComponent {

  constructor() { }

  // 菜单是否打开, 默认不打开
  @Input() open: boolean = false

  // 菜单数据, 需指定格式, 有默认值
  // 当数据中没有 open 属性时统一设置为 this.open
  // 当数据中有 open 属性时不会去改变它
  private _menuTwo: Array<MenuTwo> = menuTwo
  @Input() get menuTwo() { return this._menuTwo }
  set menuTwo(menuTwo) {
    this._menuTwo = menuTwo
    this._menuTwo.map(v => v.open == undefined && (v.open = this.open))
  }

  // [二级菜单id, 一级菜单id] 默认不选中二级菜单但选中子菜单第一项
  // 要想选中需自己传值
  // 无论菜单是否展开, 都默认不选中, 技术有限, 无法做到当菜单展开式默认选中某一项
  @Input() select: Array<string> = ['', '1']
  
}