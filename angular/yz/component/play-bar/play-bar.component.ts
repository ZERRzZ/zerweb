import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { playbar, PlayBar } from "./play-bar.model";

@Component({
  selector: 'play-bar',
  templateUrl: './play-bar.component.html',
  styleUrls: ['./play-bar.component.css']
})
export class PlayBarComponent implements OnChanges {

  constructor() { }

  @Input() playbar: PlayBar[] = playbar

  @Output() onplaybar = new EventEmitter<PlayBar>()

  ngOnChanges() { this.oninit() } // 传值改变时初始化

  onplay = false // 是否正在播放

  playid = 1 // 当前播放的 id

  interval: any = undefined // 定时器标识

  anyplay = (id: number) => {

    this.playid = id

    this.onplaybar.emit(this.playbar.find(p => p.id == this.playid))

  }

  preplay = () => this.playid > 1 && this.onplaybar.emit(this.playbar[--this.playid - 1])

  nextplay = () => this.playid < this.playbar[this.playbar.length - 1].id && this.onplaybar.emit(this.playbar[++this.playid - 1])

  play = () => {

    this.onplay = true

    this.interval = setInterval(() => {

      this.nextplay()

      if (this.playid >= this.playbar[this.playbar.length - 1].id) {
        clearInterval(this.interval)
        this.onplay = false
      }

    }, 1000)

  }

  stop = () => {

    this.onplay = false

    clearInterval(this.interval)

  }

  oninit = () => { // 重置
    this.onplay = false
    this.playid = 1
    clearInterval(this.interval)
  }

}
