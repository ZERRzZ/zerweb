import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from "@angular/core";

import { list, DDList } from "./drop-down.model"

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnChanges {

  constructor() { }

  @ViewChild('dropdownbox', { static: false }) ddbox: ElementRef

  ngOnChanges() { this.slist = this.list[0] }

  @Input() list: DDList[] = list

  @Output() listSelect = new EventEmitter<DDList>()

  show = false

  slist: DDList = this.list[0] // 选中的数据

  showlist = () => {
    if (this.show) this.closebox()
    else this.show = true
  }

  select = (l: DDList) => {
    this.slist = l
    this.listSelect.emit(l)
    this.closebox()
  }

  closebox = () => {
    this.ddbox.nativeElement.classList.add('downhide')
    setTimeout(() => this.show = false, 300)
  }

}
