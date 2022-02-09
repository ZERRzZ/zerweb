import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

import { list, SList } from "./single-list.model"

@Component({
  selector: 'single-list',
  templateUrl: './single-list.component.html',
  styleUrls: ['./single-list.component.css']
})
export class SingleListComponent implements OnChanges {

  constructor() { }

  ngOnChanges(): void { this.slist = this.list[0] }

  @Input() list: SList[] = list

  @Output() listSelect = new EventEmitter<SList>()

  show = false

  slist: SList = this.list[0] // 选中的数据

  showlist = () => this.show = !this.show

  select = (l: SList) => {
    this.slist = l
    this.listSelect.emit(l)
    this.show = false
  }

}
