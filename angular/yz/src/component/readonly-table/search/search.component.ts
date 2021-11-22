import { Component, EventEmitter, Input, Output } from "@angular/core";

import { debounce } from "../../../common/method";
import { RTBody } from "../readonly-table.model";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor() { }

  @Input() body: RTBody[] = []

  @Output() bodyChange = new EventEmitter<RTBody[]>()

  search = (e: Event) => {

    debounce(() => {

      let target = e.target as HTMLInputElement

      let sbody = this.body.filter(b => {
        for (let key in b)
          if (b[key] && b[key].toString().includes(target.value))
            return true
        return false
      })

      this.bodyChange.emit(sbody)

    }, 500)

  }

}