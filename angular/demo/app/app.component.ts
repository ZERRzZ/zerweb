import { Component } from '@angular/core';

import { AppService } from './app.service';

import { AMenu, btbody, BTBody, bthead, BTHead, PlayBar, SMenu } from 'yz/public-api';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private app: AppService) {

    this.app.getSMenu().subscribe(smenu => this.smenu = smenu) // 路由菜单

  }

  // 路由菜单
  smenu: Array<SMenu> = []

  // better-table 组件测试
  bthead: BTHead[] = bthead
  btbody: BTBody[] = btbody
  clickTr = (e: BTBody) => console.log(e)


  getCount = (e: number) => console.log(e)

  getSMenu = (e: [SMenu, AMenu]) => console.log(e)

  onplaybar = (e: PlayBar) => console.log(e)

}
