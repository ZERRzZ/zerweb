import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { MenuTwo } from 'yz/menu-two/menu-two.model';
import { SingleChoice } from 'yz/single-choice/single-choice.model';
import { Count } from 'yz/count/count.model';

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {

  menuTwo: Array<MenuTwo> = [{ id: 1, title: '标题', list: [{ id: 1, title: '列表' }] }]
  singleChoice: Array<SingleChoice> = [{ id: 1, title: '标题', list: [{ id: 1, title: '列表' }] }]

  constructor(private http: HttpClient) {
    this.http.get('assets/menu-two.json').subscribe(data => {
      this.menuTwo = data as Array<MenuTwo>
    })
    this.http.get('assets/single-choice.json').subscribe(data => {
      this.singleChoice = data as Array<SingleChoice>
    })
  }

  getMenu(e: Array<number>) {
    console.log(e)
  }

  select: number = 1
  getSingle(e: Array<number>) {
    console.log(e)
  }

  getCount(e: Count) {
    console.log(e)
  }

}
