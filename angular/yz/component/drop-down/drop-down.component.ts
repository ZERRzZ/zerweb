import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from "@angular/core";

import { list, DDList } from "./drop-down.model"

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnChanges {

  constructor() { }

  @ViewChild('dropdownbox', { static: false }) ddbox: ElementRef<HTMLElement>

  ngOnChanges() {
    this.slist = this.list[0]
    window.addEventListener('click', () => this.ddbox && this.closebox()) // 点击任意区域自动关闭
  }

  // 给元素本身加上禁止冒泡
  @HostListener('click', ['$event']) onClick(e: Event) {
    e.cancelBubble = true
  }

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
