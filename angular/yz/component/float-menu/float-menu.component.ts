import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { floatMenu, FloatMenu } from "./float-menu.model";

@Component({
  selector: 'float-menu',
  templateUrl: './float-menu.component.html',
  styleUrls: ['./float-menu.component.css']
})
export class FloatMenuComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @Input() floatMenu: FloatMenu[] = floatMenu

  @Input() onSelect: number[] = [1, 1, 1]

  @Output() onSelectChange = new EventEmitter<number[]>()

  changeFirst = (f: FloatMenu) => {

    this.onSelect[0] = f.id
    this.onSelect[1] = 1
    this.onSelect[2] = 1

    this.onSelectChange.emit(this.onSelect) // 返回当前选中的菜单 id

  }

  changeLast = (c: FloatMenu, cc: FloatMenu) => {

    this.onSelect[1] = c.id
    this.onSelect[2] = cc.id

    this.onSelectChange.emit(this.onSelect) // 返回当前选中的菜单 id

  }

  back = () => this.router.navigate(['../'], { relativeTo: this.route }) // 返回上一级

}