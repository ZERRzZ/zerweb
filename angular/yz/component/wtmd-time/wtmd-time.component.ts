import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

import { WTMD } from "./wtmd-time.model";

@Component({
  selector: 'wtmd-time',
  templateUrl: './wtmd-time.component.html',
  styleUrls: ['./wtmd-time.component.css']
})
export class WTMDTimeComponent implements OnChanges {

  constructor() { }

  @Input() sdate = new Date()

  @Input() edate = new Date()

  @Input() timetype: WTMD = 'SCOP'

  @Output() dateChange = new EventEmitter<Date[]>()

  @Output() timetypeChange = new EventEmitter<WTMD>()

  ngOnChanges() {
    if (this.timetype) {
      this.changeSdate() // 监听 type 变化实时改变时间
      this.timetypeChange.emit(this.timetype)
    }
  }

  buttoname = {
    'ONED': "天",
    'WEEK': "周",
    'TEND': "旬",
    'MONT': "月"
  }

  disabledDate = (cur: Date) => cur > new Date()// 禁止选择未来时间

  overDate = () => { // 当时间要超过今天时禁用
    switch (this.timetype) {
      case 'ONED': return new Date(this.edate.getFullYear(), this.edate.getMonth(), this.edate.getDate() + 1) >= new Date()
      case 'WEEK': return new Date(this.edate.getFullYear(), this.edate.getMonth(), this.edate.getDate() + 6) >= new Date()
      case 'TEND': return new Date(this.edate.getFullYear(), this.edate.getMonth(), this.edate.getDate() + 10) >= new Date()
      case 'MONT': return new Date(this.edate.getFullYear(), this.edate.getMonth() + 1, this.edate.getDate()) >= new Date()
    }
  }

  changeSdate = () => { // 直接改变开始日期

    switch (this.timetype) {

      case 'ONED':

        // if (this.sdate > this.edate) this.edate = this.sdate; break
        this.edate = this.sdate; break

      case 'WEEK':

        let nextweeksdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), this.sdate.getDate() + 6)
        let preweekedate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6)

        if (nextweeksdate <= new Date()) {
          this.edate = nextweeksdate
        } else {
          this.edate = new Date()
          this.sdate = preweekedate
        }
        break;

      case 'TEND':

        let spretend = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 1)
        let epretend = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 10)
        let smidtend = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 11)
        let emidtend = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 20)
        let snextend = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 21)
        let enextend = new Date(this.sdate.getFullYear(), this.sdate.getMonth() + 1, 0)
        let preweekstend = new Date(this.sdate.getFullYear(), this.sdate.getMonth() - 1, 21)
        let preweeketend = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 0)

        if (this.sdate.getDate() > 20) {
          if (enextend <= new Date()) {
            this.sdate = snextend
            this.edate = enextend
          } else {
            this.sdate = smidtend
            this.edate = emidtend
          }
        } else if (this.sdate.getDate() > 10) {
          if (emidtend <= new Date()) {
            this.sdate = smidtend
            this.edate = emidtend
          } else {
            this.sdate = spretend
            this.edate = epretend
          }
        } else {
          if (epretend <= new Date()) {
            this.sdate = spretend
            this.edate = epretend
          } else {
            this.sdate = preweekstend
            this.edate = preweeketend
          }
        }
        break;

      case 'MONT':

        let smonth = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 1)
        let emonth = new Date(this.sdate.getFullYear(), this.sdate.getMonth() + 1, 0)
        let lastsmonth = new Date(this.sdate.getFullYear(), this.sdate.getMonth() - 1, 1)
        let lastemonth = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 0)

        if (emonth <= new Date()) {
          this.sdate = smonth
          this.edate = emonth
        } else {
          this.sdate = lastsmonth
          this.edate = lastemonth
        }

    }

    this.dateChange.emit([this.sdate, this.edate])

  }

  changeEdate = () => { // 直接改变结束日期
    if (this.sdate > this.edate) this.sdate = this.edate
    this.dateChange.emit([this.sdate, this.edate])
  }

  last = () => {
    switch (this.timetype) {
      case 'ONED':
        this.sdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), this.sdate.getDate() - 1)
        this.edate = this.sdate
        break;
      case 'WEEK': this.sdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), this.sdate.getDate() - 6); break;
      case 'TEND':
        if (this.sdate.getDate() > 20) this.sdate = new Date(new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 11))
        else if (this.sdate.getDate() > 10) this.sdate = new Date(new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 1))
        else this.sdate = new Date(new Date(this.sdate.getFullYear(), this.sdate.getMonth() - 1, 21))
        break;
      case 'MONT': this.sdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth() - 1, this.sdate.getDate()); break;
    }
    this.changeSdate()
  }

  next = () => {
    switch (this.timetype) {
      case 'ONED':
        this.sdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), this.sdate.getDate() + 1)
        this.edate = this.sdate
        break
      case 'WEEK': this.sdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth(), this.sdate.getDate() + 6); break;
      case 'TEND':
        if (this.sdate.getDate() > 20) this.sdate = new Date(new Date(this.sdate.getFullYear(), this.sdate.getMonth() + 1, 1))
        else if (this.sdate.getDate() > 10) this.sdate = new Date(new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 21))
        else this.sdate = new Date(new Date(this.sdate.getFullYear(), this.sdate.getMonth(), 11))
        break;
      case 'MONT': this.sdate = new Date(this.sdate.getFullYear(), this.sdate.getMonth() + 1, this.sdate.getDate()); break;
    }
    this.changeSdate()
  }

}
