import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

import { tagsChoose } from "./tags-choose.model";

@Component({
  selector: 'tags-choose',
  templateUrl: './tags-choose.component.html',
  styleUrls: ['./tags-choose.component.css']
})
export class TagsChooseComponent {

  constructor() { }

  @Input() tagsChoose: string[] = tagsChoose

  @Input() max: number = 5

  // ngOnInit() {
  //   window.onclick = () => {
  //     if (this.showlist) {
  //       this.showlist = false
  //       this.setstr()
  //     }
  //   }
  // }

  // ngOnChanges() { if (this.lists) this.setstr() }

  // @Input() title: string

  // @Input() lists: TMS[]

  // @Output() listsChange = new EventEmitter<TMS[]>()

  // showlist = false

  // str: string = '全部'

  // choose = (e: Event) => {

  //   e.cancelBubble = true

  //   if (this.showlist) {
  //     this.showlist = false
  //     this.setstr()
  //   } else {
  //     this.showlist = true
  //   }
  // }

  // setstr = () => {
  //   this.str = ''
  //   this.lists.forEach(l => {
  //     l.ele.forEach(e => {
  //       if (e.select) this.str += `${e.desc};`
  //     })
  //   })
  //   this.listsChange.emit(this.lists)
  // }

  // chooseAll = (l: TMS) => {
  //   if (l.select) {
  //     l.select = false
  //     l.ele.forEach(e => e.select = false)
  //   } else {
  //     l.select = true
  //     l.ele.forEach(e => e.select = true)
  //   }
  // }

  // chooseOne = (e: TypeMenu, l: TMS) => {
  //   if (e.select) {
  //     e.select = false
  //     l.select = false
  //   } else {
  //     e.select = true
  //     if (!l.ele.find(e => !e.select)) l.select = true
  //   }
  // }

  // changebox = (l: TMS) => l.open = !l.open

}
