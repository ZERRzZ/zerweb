import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

import { list, DDList } from "./drop-down.model"

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnChanges {

  constructor() { }

  ngOnChanges(): void { this.slist = this.list[0] }

  @Input() list: DDList[] = list

  @Output() listSelect = new EventEmitter<DDList>()

  show = false

  slist: DDList = this.list[0] // 选中的数据

  showlist = () => this.show = !this.show

  select = (l: DDList) => {
    this.slist = l
    this.listSelect.emit(l)
    this.show = false
  }

}
