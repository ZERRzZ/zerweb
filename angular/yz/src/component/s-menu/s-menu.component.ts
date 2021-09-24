import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AMenu, SMenu } from '../../common/model';

import { smenu } from './s-menu.test';

@Component({
  selector: 's-menu',
  templateUrl: './s-menu.component.html',
  styleUrls: ['./s-menu.component.css'],
})
export class SMenuComponent implements OnChanges {

  constructor() { }

  @Input() smenu = smenu

  @Input() open = false

  @Input() select: [number, number] = [0, 0] // 初始选中, [二级菜单 id, 一级菜单 id]

  @Output() reselect = new EventEmitter<[SMenu, AMenu]>() // 传出所选中的 select [二级菜单 id, 一级菜单 id]

  ngOnChanges(changes: SimpleChanges) {
    if (changes.smenu && !changes.smenu.firstChange) {
      this.smenu.forEach(menu => {
        menu.id == this.select[0] && (menu.open = true) // 选中的菜单打开
        menu.open == undefined && (menu.open = this.open) // 数据中没有 open 属性时统一设置为 this.open 的值
      })
      if (this.select[0] > 0 && this.select[1] > 0)
        this.reselect.emit([this.smenu[this.select[0] - 1], this.smenu[this.select[0] - 1].list[this.select[1] - 1]]) // 初始化传出, 需保证 select 值大于 0
    }
  }

  selected = (menu: SMenu, list: AMenu) => {
    this.select[0] = menu.id;
    this.select[1] = list.id;
    this.reselect.emit([menu, list])
  }

}
