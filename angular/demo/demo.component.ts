import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { MenuTwo } from 'yz/menu-two/menu-two.model';

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {

  menuTwo: Array<MenuTwo> = [{ id: 1, title: '标题', list: [{ id: 1, title: '列表' }] }]

  constructor(private http: HttpClient) {
    this.http.get('assets/menu-two.json').subscribe(data => {
      this.menuTwo = data as Array<MenuTwo>
    })
  }

  getReselect(e: Array<Number>) {
    console.log(e)
  }

}
