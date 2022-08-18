import { Component } from '@angular/core';

import { AppService } from './app.service';

import { btbody, BTBody, bthead, BTHead, PlayBar, SuperMenu, tags, TagsParent } from '../../yz/public-api';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private app: AppService) {

    this.app.getSuperMenu().subscribe(smenu => this.smenu = smenu) // 路由菜单

  }

  // 路由菜单
  smenu: SuperMenu[] = []
  selectmenu = (e: SuperMenu) => console.log(e)

  // better-table 组件测试
  bthead: BTHead[] = bthead
  btbody: BTBody[] = btbody
  clickTr = (e: BTBody) => console.log(e)

  // tags-choose 组件测试
  tags: TagsParent[] = tags
  chooseTags = (e: string[]) => console.log(e)


  getCount = (e: number) => console.log(e)

  onplaybar = (e: PlayBar) => console.log(e)

}
