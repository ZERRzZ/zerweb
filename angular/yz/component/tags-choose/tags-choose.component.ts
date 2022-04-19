import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

import { tags, TagsChild, TagsParent } from "./tags-choose.model";

@Component({
  selector: 'tags-choose',
  templateUrl: './tags-choose.component.html',
  styleUrls: ['./tags-choose.component.css']
})
export class TagsChooseComponent implements OnChanges {

  constructor() { }

  @Input() tags: TagsParent[] = tags // 数据源

  @Input() max: number = 5 // 最大显示条数

  @Output() chooseTags = new EventEmitter<string[]>()

  ngOnChanges() {

    if (!this.tags || this.tags.length === 0) return

    // 父级 choose 为 true 时将子级所有项 choose 赋为 true
    this.tags.forEach(t => t.choose && t.children.forEach(tt => tt.choose = true))

    // 子级所有的项 choose 为 true 则将父级 choose 设为 true
    this.tags.forEach(t => t.children.every(tt => tt.choose) && (t.choose = true))

    this.setTagsChoose()

    // 全局监听
    window.onclick = () => this.listShow && (this.listShow = false)

  }

  // choose 为 true 的 tag 的文本
  tagsChoose: string[] = []

  // 是否显示选择窗口
  listShow = false

  // 打开选择窗口
  show = () => this.listShow = !this.listShow

  // 打开当前父级菜单
  open = (t: TagsParent) => t.open = !t.open

  chooseAll = (t: TagsParent) => {

    // 父级影响子级
    t.choose = !t.choose
    t.children.forEach(tt => tt.choose = t.choose)

    this.setTagsChoose()

  }

  chooseOne = (t: TagsParent, tt: TagsChild) => {

    // 子级影响父级
    tt.choose = !tt.choose
    t.choose = t.children.every(tt => tt.choose)

    this.setTagsChoose()

  }

  // 公用设置显示文本方法
  setTagsChoose = () => {

    this.tagsChoose = []

    // 将子级所有 choose 为 true 的值添加到 tagsChoose 里
    this.tags.forEach(t => this.tagsChoose.push(...t.children.filter(tt => tt.choose).map(tt => tt.text)))

    // 传出
    this.chooseTags.emit(this.tagsChoose)

    // 当长度超出 max 后，只显示 max 规定的条数
    if (this.tagsChoose.length > this.max) {
      let trueArr = this.tagsChoose.filter((t, i) => i < this.max)
      this.tagsChoose = [...trueArr, `+${this.tagsChoose.length - this.max}`]
    }

  }

}
